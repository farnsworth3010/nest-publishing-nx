import { BOOK_MATERIAL_CLIENT, CLIENT_PORTS } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookMaterialModule } from './book-material.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookMaterialModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ BOOK_MATERIAL_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
