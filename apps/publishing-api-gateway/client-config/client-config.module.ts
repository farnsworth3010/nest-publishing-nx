import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ClientConfigService } from './client-config.service';
import {
  AUTHOR_CLIENT,
  BOOK_CLIENT,
  BOOK_MATERIAL_CLIENT,
  CATEGORY_CLIENT,
  MATERIAL_CLIENT,
  OFFICE_CLIENT,
  ROLE_CLIENT,
  SALE_CLIENT,
  USER_CLIENT,
} from '@app/gateway/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object({
        [AUTHOR_CLIENT]: joi.number().default(3001),
        [BOOK_CLIENT]: joi.number().default(3002),
        [BOOK_MATERIAL_CLIENT]: joi.number().default(3003),
        [CATEGORY_CLIENT]: joi.number().default(3004),
        [MATERIAL_CLIENT]: joi.number().default(3005),
        [OFFICE_CLIENT]: joi.number().default(3006),
        [ROLE_CLIENT]: joi.number().default(3007),
        [SALE_CLIENT]: joi.number().default(3008),
        [USER_CLIENT]: joi.number().default(3009),
      }),
    }),
  ],
  providers: [ClientConfigService],
  exports: [ClientConfigService],
})
export class ClientConfigModule {}
