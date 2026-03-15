import { CreateMaterialDto } from '@app/contracts/material/create-material.dto';
import { Material } from '@app/contracts/material/material.entity';
import { UpdateMaterialDto } from '@app/contracts/material/update-material.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { handleTypeOrmError } from '@app/common/db-error.util';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository( Material ) private materialRepository: Repository<Material>,
  ) { }

  async create( createMaterialDto: CreateMaterialDto ): Promise<Material> {
    const material = this.materialRepository.create( createMaterialDto );

    return await this.materialRepository.save( material );
  }

  async findAll(): Promise<Material[]> {
    return await this.materialRepository.find();
  }

  async findOne( id: number ): Promise<Material> {
    const material = await this.materialRepository.findOneBy( { id } );

    if ( !material ) {
      throw new HttpException( { message: 'material not found' }, HttpStatus.NOT_FOUND );
    }

    return material;
  }

  async update( id: number, updateMaterialDto: UpdateMaterialDto ): Promise<UpdateResult> {
    const toUpdate = await this.materialRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'material not found' }, HttpStatus.NOT_FOUND );
    }

    Object.assign( toUpdate, updateMaterialDto );

    return await this.materialRepository.update( id, toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    try {
      return await this.materialRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }
}
