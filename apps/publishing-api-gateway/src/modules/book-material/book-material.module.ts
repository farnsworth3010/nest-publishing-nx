import { Module } from '@nestjs/common';
import { BookMaterialService } from './book-material.service';
import { BookMaterialController } from './book-material.controller';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from '@config/jwt.config';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { UserService } from '@app/gateway/modules/user/user.service';
import { BOOK_MATERIAL_CLIENT } from '@app/gateway/constant';
import { ClientConfigService } from '../../../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [BookMaterialController],
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
  ],
  providers: [
    BookMaterialService,
    UserService,
    {
      provide: BOOK_MATERIAL_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions =
          configService.getClientOptions(BOOK_MATERIAL_CLIENT);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class BookMaterialModule {}
