import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from '@config/jwt.config';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { UserService } from '@app/gateway/modules/user/user.service';
import { AUTHOR_CLIENT } from '@app/gateway/constant';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { ClientConfigService } from '../../../client-config/client-config.service';

@Module({
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
  ],
  controllers: [AuthorController],
  providers: [
    AuthorService,
    UserService,
    {
      provide: AUTHOR_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.getClientOptions(AUTHOR_CLIENT);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class AuthorModule {}
