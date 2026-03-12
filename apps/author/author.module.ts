import { Author } from '@app/contracts/author/author.entity';
import { TypeOrmConfigService } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NEWS_CLIENT, CLIENT_PORTS } from '@app/gateway/constant';

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
  providers: [
    AuthorService,
    {
      provide: NEWS_CLIENT,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { port: CLIENT_PORTS[ NEWS_CLIENT ] },
        });
      },
    },
  ],
} )
export class AuthorModule { }
