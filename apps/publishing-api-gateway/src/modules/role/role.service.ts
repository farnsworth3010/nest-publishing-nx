import { CreateRoleDto } from '@app/contracts/role/create-role.dto';
import { Role } from '@app/contracts/role/role.entity';
import { ROLE_PATTERNS } from '@app/contracts/role/role.pattern';
import { UpdateRoleDto } from '@app/contracts/role/update-role.dto';
import { ROLE_CLIENT } from '@app/gateway/constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class RoleService {
  constructor( @Inject( ROLE_CLIENT ) private readonly client: ClientProxy ) { }

  create( createRoleDto: CreateRoleDto ): Observable<Role> {
    return this.client.send( ROLE_PATTERNS.CREATE, createRoleDto );
  }

  findAll(): Observable<Role[]> {
    return this.client.send( ROLE_PATTERNS.FIND_ALL, {} );
  }

  findOne( id: number ): Observable<Role> {
    return this.client.send( ROLE_PATTERNS.FIND_ONE, id );
  }

  update( id: number, updateRoleDto: UpdateRoleDto ): Observable<UpdateResult> {
    return this.client.send( ROLE_PATTERNS.UPDATE, { id, updateRoleDto } );
  }

  remove( id: number ): Observable<DeleteResult> {
    return this.client.send( ROLE_PATTERNS.REMOVE, id );
  }
}
