import { CreateOfficeDto } from '@app/contracts/office/create-office.dto';
import { Office } from '@app/contracts/office/office.entity';
import { UpdateOfficeDto } from '@app/contracts/office/update-office.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository( Office ) private officeRepository: Repository<Office>,
  ) { }

  async create( createOfficeDto: CreateOfficeDto ): Promise<Office> {
    const office = this.officeRepository.create( createOfficeDto );

    return await this.officeRepository.save( office );
  }

  async findAll(): Promise<Office[]> {
    return await this.officeRepository.find();
  }

  async findOne( id: number ): Promise<Office> {
    const office = await this.officeRepository.findOneBy( { id } );

    if ( !office ) {
      throw new HttpException( { message: 'office not found' }, HttpStatus.NOT_FOUND );
    }

    return office;
  }

  async update( id: number, updateOfficeDto: UpdateOfficeDto ): Promise<UpdateResult> {
    const toUpdate = await this.officeRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'office not found' }, HttpStatus.NOT_FOUND );
    }

    Object.assign( toUpdate, updateOfficeDto );

    return await this.officeRepository.update( id, toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    return await this.officeRepository.delete( { id } );
  }
}
