import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
  );

  await app.listen();
}

void bootstrap();
