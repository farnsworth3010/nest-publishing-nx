import { Material } from '@app/contracts/material/material.entity';
import { Role } from '@app/contracts/role/role.entity';
import { User } from '@app/contracts/user/user.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Material, User, Role ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ MaterialController ],
  providers: [ MaterialService ],
} )
export class MaterialModule { }
