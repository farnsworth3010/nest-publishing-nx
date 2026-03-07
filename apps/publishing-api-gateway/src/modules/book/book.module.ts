import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { BOOK_CLIENT } from '../../constant';
import { ClientConfigService } from '../../../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '@app/gateway/modules/user/user.service';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { JwtConfigService } from '@config/jwt.config';

@Module({
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
  ],
  controllers: [BookController],
  providers: [
    BookService,
    UserService,
    {
      provide: BOOK_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.getClientOptions(BOOK_CLIENT);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class BookModule {}
