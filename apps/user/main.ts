import { CLIENT_PORTS, USER_CLIENT } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ USER_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
