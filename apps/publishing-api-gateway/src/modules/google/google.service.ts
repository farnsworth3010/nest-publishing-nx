import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly oauth2Client: OAuth2Client;
  private readonly scopes = [ 'email', 'profile' ];

  constructor( private configService: ConfigService ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>( 'GOOGLE_CLIENT_ID' ),
      this.configService.get<string>( 'GOOGLE_CLIENT_SECRET' ),
      this.configService.get<string>( 'GOOGLE_CALLBACK_URL' ),
    );
  }

  getOAuth2ClientUrl(): { url: string } {
    const url = this.oauth2Client.generateAuthUrl( {
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent',
    } );

    return { url };
  }

  async getAuthClientData( code: string ): Promise<{ email: string; name: string; googleId: string }> {
    const { tokens } = await this.oauth2Client.getToken( code );
    this.oauth2Client.setCredentials( tokens );

    const oauth2 = google.oauth2( { version: 'v2', auth: this.oauth2Client } );
    const { data } = await oauth2.userinfo.get();

    return {
      email: data.email!,
      name: data.name ?? data.email!,
      googleId: data.id!,
    };
  }
}
