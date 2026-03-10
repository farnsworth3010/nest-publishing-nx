import { CLIENT_PORTS, ROLE_CLIENT } from '@app/gateway/constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RoleModule } from './role.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RoleModule,
    {
      transport: Transport.TCP,
      options: {
        port: CLIENT_PORTS[ ROLE_CLIENT ],
      },
    },
  );

  await app.listen();
}

void bootstrap();
