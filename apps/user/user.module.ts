import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@app/contracts/book/book.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '@config/database.config';
import { Author } from '@app/contracts/author/author.entity';
import { Category } from '@app/contracts/category/category.entity';
import { Material } from '@app/contracts/material/material.entity';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { Sale } from '@app/contracts/sale/sale.entity';
import { Office } from '@app/contracts/office/office.entity';
import { User } from '@app/contracts/user/user.entity';
import { Role } from '@app/contracts/role/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    // TODO: is this okay? (importing too many entities)
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
