import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor( private configService: ConfigService ) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>( 'DB_HOST' ),
      port: +this.configService.get<number>( 'DB_PORT' )!,
      username: this.configService.get<string>( 'DB_USERNAME' ),
      password: this.configService.get<string>( 'DB_PASSWORD' ),
      database: this.configService.get<string>( 'DB_NAME' ),
      // ensure all entities from the contracts lib are loaded into the DataSource
      entities: [ __dirname + '/../libs/contracts/src/**/*.entity.{js,ts}' ],
      migrations: [ __dirname + '/../migrations/**/*.{js,ts}' ],
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
