import { Category } from '@app/contracts/category/category.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Category ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ CategoryController ],
  providers: [ CategoryService ],
} )
export class CategoryModule { }
