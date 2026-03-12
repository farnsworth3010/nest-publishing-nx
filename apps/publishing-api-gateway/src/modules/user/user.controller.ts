import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { LoginUserDto } from '@app/contracts/user/login-user.dto';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';
import { User, UserData, UserRO } from '@app/contracts/user/user.entity';
import { UserItem, UserRole } from '@app/contracts/user/user.interface';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { User as UserDecorator } from '@app/gateway/decorators/user.decorator';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';

@ApiTags( 'user' )
@Controller( 'user' )
export class UserController {
  constructor( private readonly userService: UserService ) { }

  @Get( '/profile' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  findMe( @UserDecorator( 'email' ) email: string ): Observable<UserRO> {
    return this.userService.findByEmail( email );
  }

  @Get()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  findAll(): Observable<UserItem[]> {
    return this.userService.findAll();
  }

  @Get( ':id' )
  @ApiParam( {
    name: 'id',
    type: 'integer',
    required: true,
    description: 'User ID',
  } )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  findById( @Param( 'id' ) userId ): Observable<UserRO> {
    return this.userService.findById( +userId );
  }

  @Put( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'User ID' } )

  update(
    @Param( 'id', new ParseIntPipe() ) userId: number,
    @Body( 'user' ) userData: UpdateUserDto,
  ): Observable<User> {
    return this.userService.update( userId, userData );
  }

  @Post( 'sign-up' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  create( @Body() userData: CreateUserDto ) {
    return this.userService.create( userData );
  }

  @Delete( ':slug' )
  @ApiParam( {
    name: 'slug',
    type: 'string',
    required: true,
    description: 'User slug',
  } )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  delete(
    @Param( 'id', new ParseIntPipe() ) userId: number,
  ): Observable<DeleteResult> {
    return this.userService.delete( userId );
  }

  @Post( 'sign-in' )
  login( @Body() loginUserDto: LoginUserDto ): Observable<UserRO> {
    return this.userService.findOne( loginUserDto ).pipe(
      map( ( _user: UserData ) => {
        if ( !_user ) throw new UnauthorizedException();

        const token: string = this.userService.generateJWT( _user as User );

        const { email, name, role, office } = _user;
        const user = { email, token, name, role, office };

        const tempPassword: string | undefined = _user?.[ 'tempPassword' ];

        if ( tempPassword ) {
          user[ 'tempPassword' ] = tempPassword;
        }

        return { user };
      } ),
      catchError( () => throwError( () => new UnauthorizedException() ) ),
    );
  }
}
