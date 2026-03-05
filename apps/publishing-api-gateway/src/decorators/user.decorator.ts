import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const configService = new ConfigService();
    const SECRET = configService.get<string>('JWT_SECRET');

    if (req.user) {
      return data ? req.user[data] : req.user;
    }

    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')
      : null;

    if (token && token[1] && SECRET) {
      const decoded: any = jwt.verify(token[1], SECRET);

      return data ? decoded[data] : decoded.user;
    }
  },
);
