import { Category } from '@app/contracts/category/category.entity';
import { CreateCategoryDto } from '@app/contracts/category/create-category.dto';
import { UpdateCategoryDto } from '@app/contracts/category/update-category.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { handleTypeOrmError } from '@app/common/db-error.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository( Category ) private categoryRepository: Repository<Category>,
  ) { }

  async create( createCategoryDto: CreateCategoryDto ): Promise<Category> {
    const category = this.categoryRepository.create( createCategoryDto );

    return await this.categoryRepository.save( category );
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne( id: number ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy( { id } );

    if ( !category ) {
      throw new HttpException( { message: 'category not found' }, HttpStatus.NOT_FOUND );
    }

    return category;
  }

  async update( id: number, updateCategoryDto: UpdateCategoryDto ): Promise<UpdateResult> {
    const toUpdate = await this.categoryRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'category not found' }, HttpStatus.NOT_FOUND );
    }

    Object.assign( toUpdate, updateCategoryDto );

    return await this.categoryRepository.update( { id }, toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    try {
      return await this.categoryRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }
}
