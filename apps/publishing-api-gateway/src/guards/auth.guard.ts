import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/gateway/modules/user/user.service';
import { map, Observable, of } from 'rxjs';
import { UserData } from '@app/contracts/user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> | never {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];

      try {
        const decoded: UserData = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        if (decoded.id) {
          return this.userService.findById(decoded?.id).pipe(
            map((user) => {
              if (!user) {
                throw new HttpException(
                  'User not found.',
                  HttpStatus.UNAUTHORIZED,
                );
              }

              // TODO: fix type
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              req.user = user?.user;

              return true;
            }),
          );
        }

        return of(false);
      } catch {
        throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
