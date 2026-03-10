import { JwtConfigService } from '@config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { CLIENT_PORTS, USER_CLIENT } from '../../constant';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module( {
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync( {
      imports: [ ConfigModule ],
      useClass: JwtConfigService,
    } ),
    UserModule,
    ClientsModule.register( [
      {
        name: USER_CLIENT,
        transport: Transport.TCP,
        options: {
          port: CLIENT_PORTS[ USER_CLIENT ],
        },
      },
    ] ),
  ],
  providers: [ UserService ],
  controllers: [ UserController ],
  exports: [ ClientsModule ],
} )
export class UserModule { }
