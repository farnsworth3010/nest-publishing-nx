import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { Book } from '@app/contracts/book/book.entity';
import { Material } from '@app/contracts/material/material.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookMaterialController } from './book-material.controller';
import { BookMaterialService } from './book-material.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ BookMaterial, Book, Material ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ BookMaterialController ],
  providers: [ BookMaterialService ],
} )
export class BookMaterialModule { }
