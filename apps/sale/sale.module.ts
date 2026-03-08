import { Book } from '@app/contracts/book/book.entity';
import { Office } from '@app/contracts/office/office.entity';
import { Sale } from '@app/contracts/sale/sale.entity';
import { User } from '@app/contracts/user/user.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Sale, Office, Book, User ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ SaleController ],
  providers: [ SaleService ],
} )
export class SaleModule { }
