import { CATEGORY_CLIENT, CLIENT_PORTS } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CategoryModule } from './category.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CategoryModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ CATEGORY_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
