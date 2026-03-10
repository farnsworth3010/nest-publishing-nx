import { CLIENT_PORTS, NEWS_CLIENT } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NewsModule } from './news.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NewsModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ NEWS_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
