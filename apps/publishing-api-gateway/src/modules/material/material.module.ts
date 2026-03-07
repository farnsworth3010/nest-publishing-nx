import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from '@config/jwt.config';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { UserService } from '@app/gateway/modules/user/user.service';
import { MATERIAL_CLIENT } from '@app/gateway/constant';
import { ClientConfigService } from '../../../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [MaterialController],
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
  ],
  providers: [
    MaterialService,
    UserService,
    {
      provide: MATERIAL_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.getClientOptions(MATERIAL_CLIENT);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class MaterialModule {}
