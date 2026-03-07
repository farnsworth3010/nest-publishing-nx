import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { User as UserDecorator } from '@app/gateway/decorators/user.decorator';
import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { UserItem, UserRole } from '@app/contracts/user/user.interface';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { ApiParam } from '@nestjs/swagger';
import { User, UserData, UserRO } from '@app/contracts/user/user.entity';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';
import { LoginUserDto } from '@app/contracts/user/login-user.dto';
import { map, Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  findMe(@UserDecorator('email') email: string): Observable<UserRO> {
    return this.userService.findByEmail(email);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(): Observable<UserItem[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    required: true,
    description: 'User ID',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findById(@Param('id') userId): Observable<UserRO> {
    return this.userService.findById(+userId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', new ParseIntPipe()) userId: number,
    @Body('user') userData: UpdateUserDto,
  ): Observable<User> {
    return this.userService.update(userId, userData);
  }

  @Post('sign-up')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete(':slug')
  @ApiParam({
    name: 'slug',
    type: 'string',
    required: true,
    description: 'User slug',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  delete(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Observable<DeleteResult> {
    return this.userService.delete(userId);
  }

  @Post('sign-in')
  login(@Body() loginUserDto: LoginUserDto): Observable<UserRO> {
    return this.userService.findOne(loginUserDto).pipe(
      map((_user: UserData) => {
        Logger.log('sss');
        const errors = { User: 'not found' };
        if (!_user) throw new HttpException({ errors }, 404);

        const token: string = this.userService.generateJWT(_user as User);

        const { email, name, role, office } = _user;
        const user = { email, token, name, role, office };

        const tempPassword: string | undefined = _user?.['tempPassword'];

        if (tempPassword) {
          user['tempPassword'] = tempPassword;
        }

        return { user };
      }),
    );
  }
}
