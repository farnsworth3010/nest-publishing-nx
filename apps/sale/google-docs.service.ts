import { Sale } from '@app/contracts/sale/sale.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { docs_v1, google } from 'googleapis';

@Injectable()
export class GoogleDocsService {
  constructor( private configService: ConfigService ) { }

  private getAuthClient() {
    const email = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_EMAIL' );
    const key = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY' )!
      .replace( /\\n/g, '\n' );

    return new google.auth.JWT( {
      email,
      key,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ],
    } );
  }

  async exportSalesReport(
    sales: Sale[],
    startDate: string,
    endDate: string,
  ): Promise<{ documentUrl: string }> {
    const auth = this.getAuthClient();
    const docs = google.docs( { version: 'v1', auth } );
    const drive = google.drive( { version: 'v3', auth } );

    const title = `Sales Report: ${ startDate } — ${ endDate }`;

    const document = await docs.documents.create( {
      requestBody: { title },
    } );

    const documentId = document.data.documentId!;

    const totalRevenue = sales.reduce( ( sum, s ) => {
      const price = typeof s.price === 'string'
        ? parseFloat( ( s.price as string ).replace( /[^0-9.-]/g, '' ) )
        : s.price;
      return sum + ( price * s.amount );
    }, 0 );

    const totalAmount = sales.reduce( ( sum, s ) => sum + s.amount, 0 );

    const cols = 8;
    const rows = sales.length + 1;

    const requests: docs_v1.Schema$Request[] = [];

    const summary = `\nPeriod: ${ startDate } to ${ endDate }\n`
      + `Total sales: ${ sales.length } transactions, ${ totalAmount } items\n`
      + `Total revenue: ${ Math.round( totalRevenue * 100 ) / 100 } BYN\n\n`;

    requests.push( {
      insertText: {
        location: { index: 1 },
        text: summary,
      },
    } );

    const tableInsertIndex = 1 + summary.length;

    requests.push( {
      insertTable: {
        rows,
        columns: cols,
        location: { index: tableInsertIndex },
      },
    } );

    await docs.documents.batchUpdate( {
      documentId,
      requestBody: { requests },
    } );

    const updatedDoc = await docs.documents.get( { documentId } );
    const body = updatedDoc.data.body!;
    const table = body.content!.find( ( el ) => el.table )?.table;

    if ( !table ) {
      return { documentUrl: `https://docs.google.com/document/d/${ documentId }/edit` };
    }

    const cellRequests: docs_v1.Schema$Request[] = [];

    const headers = [ '#', 'Date', 'Book', 'Buyer', 'Office', 'Amount', 'Price (BYN)', 'External' ];

    for ( let col = 0; col < cols; col++ ) {
      const cell = table.tableRows![ 0 ].tableCells![ col ];
      const cellIndex = cell.content![ 0 ].paragraph!.elements![ 0 ].startIndex!;

      cellRequests.push( {
        insertText: {
          location: { index: cellIndex },
          text: headers[ col ],
        },
      } );
    }

    for ( let row = sales.length - 1; row >= 0; row-- ) {
      const sale = sales[ row ];
      const price = typeof sale.price === 'string'
        ? parseFloat( ( sale.price as string ).replace( /[^0-9.-]/g, '' ) )
        : sale.price;

      const rowData = [
        String( row + 1 ),
        sale.date ? new Date( sale.date ).toISOString().slice( 0, 10 ) : '',
        sale.book?.name ?? `Book #${ sale.bookId }`,
        sale.user?.name ?? `User #${ sale.userId }`,
        sale.office?.address ?? '—',
        String( sale.amount ),
        String( Math.round( price * 100 ) / 100 ),
        sale.isExternal ? 'Yes' : 'No',
      ];

      for ( let col = cols - 1; col >= 0; col-- ) {
        const cell = table.tableRows![ row + 1 ].tableCells![ col ];
        const cellIndex = cell.content![ 0 ].paragraph!.elements![ 0 ].startIndex!;

        cellRequests.push( {
          insertText: {
            location: { index: cellIndex },
            text: rowData[ col ],
          },
        } );
      }
    }

    for ( let col = 0; col < cols; col++ ) {
      const cell = table.tableRows![ 0 ].tableCells![ col ];
      const cellIndex = cell.content![ 0 ].paragraph!.elements![ 0 ].startIndex!;

      cellRequests.push( {
        updateTextStyle: {
          range: {
            startIndex: cellIndex,
            endIndex: cellIndex + headers[ col ].length,
          },
          textStyle: { bold: true },
          fields: 'bold',
        },
      } );
    }

    if ( cellRequests.length > 0 ) {
      await docs.documents.batchUpdate( {
        documentId,
        requestBody: { requests: cellRequests },
      } );
    }

    const shareEmail = this.configService.get<string>( 'GOOGLE_SHEETS_SHARE_EMAIL' );
    if ( shareEmail ) {
      await drive.permissions.create( {
        fileId: documentId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: shareEmail,
        },
      } );
    }

    return {
      documentUrl: `https://docs.google.com/document/d/${ documentId }/edit`,
    };
  }
}
