import { Sale } from '@app/contracts/sale/sale.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { calendar_v3, google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  constructor( private configService: ConfigService ) { }

  private getAuthClient() {
    const email = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_EMAIL' );
    const key = this.configService.get<string>( 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY' )!
      .replace( /\\n/g, '\n' );

    return new google.auth.JWT( {
      email,
      key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
      ],
    } );
  }

  private getCalendarId(): string {
    return this.configService.get<string>( 'GOOGLE_CALENDAR_ID' ) ?? 'primary';
  }

  async addSalesToCalendar( sales: Sale[] ): Promise<{ calendarId: string; eventsCreated: number }> {
    const auth = this.getAuthClient();
    const calendar = google.calendar( { version: 'v3', auth } );
    const calendarId = this.getCalendarId();

    let eventsCreated = 0;

    for ( const sale of sales ) {
      const price = typeof sale.price === 'string'
        ? parseFloat( ( sale.price as string ).replace( /[^0-9.-]/g, '' ) )
        : sale.price;

      const saleDate = new Date( sale.date );
      const dateStr = saleDate.toISOString().slice( 0, 10 );

      const bookName = sale.book?.name ?? `Book #${ sale.bookId }`;
      const buyerName = sale.user?.name ?? `User #${ sale.userId }`;
      const officeName = sale.office?.address ?? '—';

      const event: calendar_v3.Schema$Event = {
        summary: `Sale: ${ bookName } x${ sale.amount }`,
        description: [
          `Book: ${ bookName }`,
          `Buyer: ${ buyerName }`,
          `Office: ${ officeName }`,
          `Amount: ${ sale.amount }`,
          `Price: ${ Math.round( price * 100 ) / 100 } BYN`,
          `External: ${ sale.isExternal ? 'Yes' : 'No' }`,
          `Sale ID: ${ sale.id }`,
        ].join( '\n' ),
        start: { date: dateStr },
        end: { date: dateStr },
      };

      await calendar.events.insert( {
        calendarId,
        requestBody: event,
      } );

      eventsCreated++;
    }

    return { calendarId, eventsCreated };
  }

  async getCalendarEvents(
    startDate: string,
    endDate: string,
  ): Promise<calendar_v3.Schema$Event[]> {
    const auth = this.getAuthClient();
    const calendar = google.calendar( { version: 'v3', auth } );
    const calendarId = this.getCalendarId();

    const response = await calendar.events.list( {
      calendarId,
      timeMin: new Date( startDate ).toISOString(),
      timeMax: new Date( endDate + 'T23:59:59' ).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    } );

    return response.data.items ?? [];
  }
}
