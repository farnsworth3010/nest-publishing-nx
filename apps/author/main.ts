import { AUTHOR_CLIENT, CLIENT_PORTS } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthorModule } from './author.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthorModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ AUTHOR_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
