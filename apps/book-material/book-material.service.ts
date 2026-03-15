import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { CreateBookMaterialDto } from '@app/contracts/book-material/create-book-material.dto';
import { UpdateBookMaterialDto } from '@app/contracts/book-material/update-book-material.dto';
import { Book } from '@app/contracts/book/book.entity';
import { Material } from '@app/contracts/material/material.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { handleTypeOrmError } from '@app/common/db-error.util';

@Injectable()
export class BookMaterialService {
  constructor(
    @InjectRepository( BookMaterial ) private bookMaterialRepository: Repository<BookMaterial>,
    @InjectRepository( Book ) private bookRepository: Repository<Book>,
    @InjectRepository( Material ) private materialRepository: Repository<Material>,
  ) { }

  async create( createBookMaterialDto: CreateBookMaterialDto ): Promise<BookMaterial> {
    const { bookId, materialId }: { bookId: number; materialId: number; } = createBookMaterialDto;

    const book: Book | null = await this.bookRepository.findOneBy( { id: bookId } );

    if ( !book ) {
      throw new HttpException( { message: 'Book not found' }, HttpStatus.BAD_REQUEST );
    }

    const material: Material | null = await this.materialRepository.findOneBy( { id: materialId } );

    if ( !material ) {
      throw new HttpException( { message: 'Material not found' }, HttpStatus.BAD_REQUEST );
    }

    const bookMaterial = this.bookMaterialRepository.create( createBookMaterialDto );

    return await this.bookMaterialRepository.save( bookMaterial );
  }

  async findAll(): Promise<BookMaterial[]> {
    return await this.bookMaterialRepository.find();
  }

  async findOne( id: number ): Promise<BookMaterial> {
    const bookMaterial = await this.bookMaterialRepository.findOneBy( { id } );

    if ( !bookMaterial ) {
      throw new HttpException( { message: 'BookMaterial not found' }, HttpStatus.NOT_FOUND );
    }

    return bookMaterial;
  }

  async update( id: number, updateBookMaterialDto: UpdateBookMaterialDto ): Promise<UpdateResult> {
    const toUpdate = await this.bookMaterialRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'bookMaterial not found' }, HttpStatus.NOT_FOUND );
    }

    Object.assign( toUpdate, updateBookMaterialDto );

    return this.bookMaterialRepository.update( { id }, toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    try {
      return await this.bookMaterialRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }
}
