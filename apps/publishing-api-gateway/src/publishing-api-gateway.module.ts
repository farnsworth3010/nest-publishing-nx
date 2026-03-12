import { AuthorModule } from '@app/gateway/modules/author/author.module';
import { BookMaterialModule } from '@app/gateway/modules/book-material/book-material.module';
import { BookModule } from '@app/gateway/modules/book/book.module';
import { CategoryModule } from '@app/gateway/modules/category/category.module';
import { MaterialModule } from '@app/gateway/modules/material/material.module';
import { OfficeModule } from '@app/gateway/modules/office/office.module';
import { RoleModule } from '@app/gateway/modules/role/role.module';
import { SaleModule } from '@app/gateway/modules/sale/sale.module';
import { UserModule } from '@app/gateway/modules/user/user.module';
import { JwtConfigService } from '@config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NewsModule } from 'apps/news/news.module';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: true } ),
    JwtModule.registerAsync( {
      imports: [ ConfigModule ],
      useClass: JwtConfigService,
    } ),
    UserModule,
    BookModule,
    AuthorModule,
    BookMaterialModule,
    CategoryModule,
    MaterialModule,
    OfficeModule,
    RoleModule,
    SaleModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
} )
export class PublishingApiGatewayModule { }
