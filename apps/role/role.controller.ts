import { CreateRoleDto } from '@app/contracts/role/create-role.dto';
import { Role } from '@app/contracts/role/role.entity';
import { ROLE_PATTERNS } from '@app/contracts/role/role.pattern';
import { UpdateRoleDto } from '@app/contracts/role/update-role.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor( private readonly roleService: RoleService ) { }

  @MessagePattern( ROLE_PATTERNS.CREATE )
  async create( @Payload() data: CreateRoleDto ): Promise<Role> {
    return await this.roleService.create( data );
  }

  @MessagePattern( ROLE_PATTERNS.FIND_ONE )
  async findById( @Payload() id: number ): Promise<Role> {
    return await this.roleService.findById( id );
  }

  @MessagePattern( ROLE_PATTERNS.FIND_ALL )
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @MessagePattern( ROLE_PATTERNS.UPDATE )
  async update( @Payload() { id, data }: { id: number; data: UpdateRoleDto; } ): Promise<Role> {
    return await this.roleService.update( id, data );
  }

  @MessagePattern( ROLE_PATTERNS.REMOVE )
  async delete( @Payload() id: number ): Promise<DeleteResult> {
    return await this.roleService.delete( id );
  }
}
