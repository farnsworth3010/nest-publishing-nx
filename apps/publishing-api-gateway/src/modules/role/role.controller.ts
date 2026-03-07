import { CreateRoleDto } from '@app/contracts/role/create-role.dto';
import { Role } from '@app/contracts/role/role.entity';
import { UpdateRoleDto } from '@app/contracts/role/update-role.dto';
import { UserRole } from '@app/contracts/user/user.interface';
import { Roles } from '@app/gateway/decorators/roles.decorator';
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
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { RoleService } from './role.service';

@Controller( 'role' )
export class RoleController {
  constructor( private readonly roleService: RoleService ) { }

  @Post()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  create( @Body() data: CreateRoleDto ): Observable<Role> {
    return this.roleService.create( data );
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  findOne( @Param( 'id', new ParseIntPipe() ) id: number ): Observable<Role> {
    return this.roleService.findOne( id );
  }

  @Get()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  findAll(): Observable<Role[]> {
    return this.roleService.findAll();
  }

  @Put( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  update(
    @Param( 'id', new ParseIntPipe() ) id: number,
    @Body() data: UpdateRoleDto,
  ): Observable<UpdateResult> {
    return this.roleService.update( id, data );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  remove( @Param( 'id', new ParseIntPipe() ) id: number ): Observable<DeleteResult> {
    return this.roleService.remove( id );
  }
}
