import { BOOK_CLIENT, CLIENT_PORTS } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookModule } from './book.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ BOOK_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
