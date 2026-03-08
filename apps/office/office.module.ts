import { Office } from '@app/contracts/office/office.entity';
import { Role } from '@app/contracts/role/role.entity';
import { User } from '@app/contracts/user/user.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Office, User, Role ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ OfficeController ],
  providers: [ OfficeService ],
} )
export class OfficeModule { }
