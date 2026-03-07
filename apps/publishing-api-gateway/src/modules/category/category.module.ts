import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from '@config/jwt.config';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { UserService } from '@app/gateway/modules/user/user.service';
import { CATEGORY_CLIENT } from '@app/gateway/constant';
import { ClientConfigService } from '../../../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
  ],
  providers: [
    CategoryService,
    UserService,
    {
      provide: CATEGORY_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.getClientOptions(CATEGORY_CLIENT);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class CategoryModule {}
