import { CLIENT_PORTS } from '@app/gateway/constant';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ClientConfigService } from './client-config.service';

function buildClientPortsSchema(): joi.SchemaMap {
  const schema: joi.SchemaMap = {};

  for ( const [ key, def ] of Object.entries( CLIENT_PORTS ) ) {
    // allow overriding via env var, must be a positive integer
    schema[ key ] = joi.number().integer().positive().default( def ) as any;
  }

  return schema;
}

@Module( {
  imports: [
    ConfigModule.forRoot( {
      isGlobal: false,
      validationSchema: joi.object( buildClientPortsSchema() ),
    } ),
  ],
  providers: [ ClientConfigService ],
  exports: [ ClientConfigService ],
} )
export class ClientConfigModule { }
