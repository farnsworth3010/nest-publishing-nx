import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RoleModule } from './role.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RoleModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3007,
      },
    },
  );

  await app.listen();
}

void bootstrap();
