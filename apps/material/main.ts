import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MaterialModule } from './material.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MaterialModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3005,
      },
    },
  );

  await app.listen();
}

void bootstrap();
