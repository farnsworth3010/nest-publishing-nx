import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor(private config: ConfigService) {}

  getClientPort(clientId: symbol): number {
    return this.config.get<number>(clientId.toString())!;
  }

  getClientOptions(clientId: symbol): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getClientPort(clientId),
      },
    };
  }
}
