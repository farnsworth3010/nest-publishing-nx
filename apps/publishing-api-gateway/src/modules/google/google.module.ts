import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module( {
  imports: [ ConfigModule, UserModule ],
  controllers: [ GoogleController ],
  providers: [ GoogleService ],
} )
export class GoogleModule { }
