import { OFFICE_CLIENT } from '@app/gateway/constant';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { UserService } from '@app/gateway/modules/user/user.service';
import { JwtConfigService } from '@config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../../../client-config/client-config.module';
import { ClientConfigService } from '../../../client-config/client-config.service';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';

@Module( {
  controllers: [ OfficeController ],
  imports: [
    ClientConfigModule,
    JwtModule.registerAsync( {
      imports: [ ConfigModule ],
      useClass: JwtConfigService,
    } ),
    UserModule,
  ],
  providers: [
    OfficeService,
    UserService,
    {
      provide: OFFICE_CLIENT,
      useFactory: ( configService: ClientConfigService ) => {
        const clientOptions = configService.getClientOptions( OFFICE_CLIENT );
        return ClientProxyFactory.create( clientOptions );
      },
      inject: [ ClientConfigService ],
    },
  ],
} )
export class OfficeModule { }
