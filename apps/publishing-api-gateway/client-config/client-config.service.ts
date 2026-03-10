import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor( private config: ConfigService ) { }

  getClientPort( clientId: string ): number {
    Logger.log( `Getting port for client ${ clientId }` );
    Logger.log( `Port: ${ this.config.get<number>( clientId ) }` );
    return this.config.get<number>( clientId )!;
  }

  getClientOptions( clientId: string ): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getClientPort( clientId ),
      },
    };
  }
}
