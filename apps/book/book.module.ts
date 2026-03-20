import { Author } from '@app/contracts/author/author.entity';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { Book } from '@app/contracts/book/book.entity';
import { Category } from '@app/contracts/category/category.entity';
import { Material } from '@app/contracts/material/material.entity';
import { Office } from '@app/contracts/office/office.entity';
import { Role } from '@app/contracts/role/role.entity';
import { Sale } from '@app/contracts/sale/sale.entity';
import { User } from '@app/contracts/user/user.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { GoogleSheetsService } from './google-sheets.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }),
    HttpModule,
    TypeOrmModule.forFeature([
      Book,
      Author,
      Category,
      Material,
      BookMaterial,
      Sale,
      Office,
      User,
      Role,
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [BookController],
  providers: [BookService, GoogleSheetsService],
})
export class BookModule {}
