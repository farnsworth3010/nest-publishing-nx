import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { GoogleAuthUserDto } from '@app/contracts/user/google-auth-user.dto';
import { LoginUserDto } from '@app/contracts/user/login-user.dto';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';
import { User, UserRO } from '@app/contracts/user/user.entity';
import { UserItem } from '@app/contracts/user/user.interface';
import { USER_PATTERNS } from '@app/contracts/user/user.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { addMinutes } from 'date-fns';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { USER_CLIENT } from '../../constant';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_CLIENT) private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  findOne({ email, password }: LoginUserDto): Observable<User> {
    return this.userClient.send(USER_PATTERNS.FIND_ONE, { email, password });
  }

  create(dto: CreateUserDto): Observable<UserRO> {
    return this.userClient.send(USER_PATTERNS.CREATE, dto);
  }

  update(id: number, dto: UpdateUserDto): Observable<User> {
    return this.userClient.send(USER_PATTERNS.UPDATE, { id, dto });
  }

  delete(id: number): Observable<DeleteResult> {
    return this.userClient.send(USER_PATTERNS.REMOVE, id);
  }

  findById(id: number): Observable<UserRO> {
    return this.userClient.send(USER_PATTERNS.FIND_BY_ID, id);
  }

  findAll(): Observable<UserItem[]> {
    return this.userClient.send(USER_PATTERNS.FIND_ALL, {});
  }

  findByEmail(email: string): Observable<UserRO> {
    return this.userClient.send(USER_PATTERNS.FIND_BY_EMAIL, email);
  }

  findOrCreateByGoogle(dto: GoogleAuthUserDto): Observable<UserRO> {
    return this.userClient.send(USER_PATTERNS.FIND_OR_CREATE_BY_GOOGLE, dto);
  }

  public generateJWT(user: User) {
    const today = new Date();
    const exp = addMinutes(today, 60).getTime();

    return this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp,
    });
  }
}
