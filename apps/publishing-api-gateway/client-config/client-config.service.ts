import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor(private config: ConfigService) {}

  getBookClientPort(): number {
    return this.config.get<number>('BOOK_CLIENT_PORT')!;
  }

  getUserClientPort(): number {
    return this.config.get<number>('USER_CLIENT_PORT')!;
  }

  get bookClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getBookClientPort(),
      },
    };
  }

  get userClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getUserClientPort(),
      },
    };
  }
}
