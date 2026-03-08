import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CategoryModule } from './category.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CategoryModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3004,
      },
    },
  );

  await app.listen();
}

void bootstrap();
