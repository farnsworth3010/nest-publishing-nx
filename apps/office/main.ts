import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OfficeModule } from './office.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OfficeModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3006,
      },
    },
  );

  await app.listen();
}

void bootstrap();
