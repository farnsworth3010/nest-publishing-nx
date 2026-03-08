import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthorModule } from './author.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthorModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3009,
      },
    },
  );

  await app.listen();
}

void bootstrap();
