import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@app/contracts/book/book.entity';
import { Author } from '@app/contracts/author/author.entity';
import { Category } from '@app/contracts/category/category.entity';
import { Material } from '@app/contracts/material/material.entity';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sale } from '@app/contracts/sale/sale.entity';
import { Office } from '@app/contracts/office/office.entity';
import { User } from '@app/contracts/user/user.entity';
import { Role } from '@app/contracts/role/role.entity';
import { TypeOrmConfigService } from '@config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }),
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
  providers: [BookService],
})
export class BookModule {}
