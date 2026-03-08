import { Author } from '@app/contracts/author/author.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: false } ),
    TypeOrmModule.forFeature( [ Author ] ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useClass: TypeOrmConfigService,
      inject: [ ConfigService ],
    } ),
  ],
  controllers: [ AuthorController ],
  providers: [ AuthorService ],
} )
export class AuthorModule { }
