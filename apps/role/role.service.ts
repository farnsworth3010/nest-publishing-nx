import { CreateRoleDto } from '@app/contracts/role/create-role.dto';
import { Role } from '@app/contracts/role/role.entity';
import { UpdateRoleDto } from '@app/contracts/role/update-role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { handleTypeOrmError } from '@app/common/db-error.util';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository( Role )
    private readonly roleRepository: Repository<Role>,
  ) { }

  async create( dto: CreateRoleDto ): Promise<Role> {
    const role = await this.roleRepository.create( dto );

    return await this.roleRepository.save( role );
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findById( id: number ): Promise<Role> {
    const role = await this.roleRepository.findOneBy( { id } );

    if ( !role ) {
      throw new HttpException( 'Role not found', HttpStatus.NOT_FOUND );
    }

    return role;
  }

  async update( id: number, data: UpdateRoleDto ): Promise<Role> {
    const toUpdate = await this.roleRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( 'Role not found', HttpStatus.NOT_FOUND );
    }

    const updated = Object.assign( toUpdate, data );

    return await this.roleRepository.save( updated );
  }

  async delete( id: number ): Promise<DeleteResult> {
    try {
      return await this.roleRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }
}
