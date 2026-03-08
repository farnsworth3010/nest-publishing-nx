import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SaleModule } from './sale.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SaleModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3008,
      },
    },
  );

  await app.listen();
}

void bootstrap();
