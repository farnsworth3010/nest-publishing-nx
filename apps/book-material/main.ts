import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookMaterialModule } from './book-material.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookMaterialModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
      },
    },
  );

  await app.listen();
}

void bootstrap();
