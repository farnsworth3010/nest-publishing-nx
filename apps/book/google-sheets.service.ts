import { Book } from '@app/contracts/book/book.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  constructor( private configService: ConfigService ) { }

  private getAuthClient() {
    const email = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_EMAIL' );
    const key = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY' )!
      .replace( /\\n/g, '\n' );

    return new google.auth.JWT( {
      email,
      key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    } );
  }

  async exportBooks( books: Book[] ): Promise<{ spreadsheetUrl: string }> {
    const auth = this.getAuthClient();

    const sheets = google.sheets( { version: 'v4', auth } );
    const drive = google.drive( { version: 'v3', auth } );

    const spreadsheet = await sheets.spreadsheets.create( {
      requestBody: {
        properties: {
          title: `Books Export — ${ new Date().toISOString().slice( 0, 10 ) }`,
        },
        sheets: [
          {
            properties: { title: 'Books' },
          },
        ],
      },
    } );

    const spreadsheetId = spreadsheet.data.spreadsheetId!;

    const header = [
      'ID', 'Name', 'Pages', 'Value (BYN)', 'Quantity',
      'Publishing Start', 'Publishing End', 'Authors', 'Categories', 'Materials',
    ];

    const rows = books.map( ( book ) => [
      book.id,
      book.name,
      book.pages,
      typeof book.value === 'string'
        ? parseFloat( ( book.value as string ).replace( /[^0-9.-]/g, '' ) )
        : book.value,
      book.quantity,
      book.publishingStart ? new Date( book.publishingStart ).toISOString().slice( 0, 10 ) : '',
      book.publishingEnd ? new Date( book.publishingEnd ).toISOString().slice( 0, 10 ) : '',
      ( book.authors ?? [] ).map( ( a ) => `${ a.firstName } ${ a.lastName ?? '' }`.trim() ).join( ', ' ),
      ( book.categories ?? [] ).map( ( c ) => c.name ).join( ', ' ),
      ( book.bookMaterials ?? [] ).map( ( bm ) => `${ bm.material?.name ?? bm.material_id } (x${ bm.amount })` ).join( ', ' ),
    ] );

    await sheets.spreadsheets.values.update( {
      spreadsheetId,
      range: 'Books!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [ header, ...rows ],
      },
    } );

    await sheets.spreadsheets.batchUpdate( {
      spreadsheetId,
      requestBody: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: spreadsheet.data.sheets![ 0 ].properties!.sheetId!,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: header.length,
              },
            },
          },
        ],
      },
    } );

    const shareEmail = this.configService.get<string>( 'GOOGLE_SHEETS_SHARE_EMAIL' );
    if ( shareEmail ) {
      await drive.permissions.create( {
        fileId: spreadsheetId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: shareEmail,
        },
      } );
    }

    return {
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${ spreadsheetId }/edit`,
    };
  }
}
