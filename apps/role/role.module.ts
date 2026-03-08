import { Office } from '@app/contracts/office/office.entity';
import { Role } from '@app/contracts/role/role.entity';
import { User } from '@app/contracts/user/user.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Role, User, Office ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ RoleController ],
  providers: [ RoleService ],
} )
export class RoleModule { }
