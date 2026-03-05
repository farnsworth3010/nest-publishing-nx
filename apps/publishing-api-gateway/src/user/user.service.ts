import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_CLIENT } from '../constant';
import { USER_PATTERNS } from '@app/contracts/user/user.pattern';
import { User, UserRO } from '@app/contracts/user/user.entity';
import { LoginUserDto } from '@app/contracts/user/login-user.dto';
import { Observable } from 'rxjs';
import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';
import { DeleteResult } from 'typeorm';
import { UserItem } from '@app/contracts/user/user.interface';
import { addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

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
