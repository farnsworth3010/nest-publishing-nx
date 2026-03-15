import { Author } from '@app/contracts/author/author.entity';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { Book } from '@app/contracts/book/book.entity';
import { CreateBookDto } from '@app/contracts/book/create-book.dto';
import { UpdateBookDto } from '@app/contracts/book/update-book.dto';
import { Category } from '@app/contracts/category/category.entity';
import { MaterialDto } from '@app/contracts/material/material.dto';
import { Material } from '@app/contracts/material/material.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { handleTypeOrmError } from '@app/common/db-error.util';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository( Book ) private bookRepository: Repository<Book>,
    @InjectRepository( Author ) private authorRepository: Repository<Author>,
    @InjectRepository( Category )
    private categoryRepository: Repository<Category>,
    @InjectRepository( Material )
    private materialRepository: Repository<Material>,
    @InjectRepository( BookMaterial )
    private bookMaterialRepository: Repository<BookMaterial>,
  ) { }

  async create( createBookDto: CreateBookDto ): Promise<Book> {
    const { categoryIds, authorIds, materials, quantity } = createBookDto;

    const categories: Category[] = await this.getCategories( categoryIds );
    const authors: Author[] = await this.getAuthors( authorIds );

    if ( !createBookDto.forceQuantity ) {
      await this.checkAndProcessMaterials( materials, quantity );
    }

    const book: Book = this.bookRepository.create( createBookDto );

    book.categories = categories;
    book.authors = authors;

    const res: Book = await this.bookRepository.save( book );

    await Promise.all(
      materials.map( async ( materialDto: MaterialDto ) => {
        const { id, amount } = materialDto;

        const material: Material | null =
          await this.materialRepository.findOneBy( { id } );

        const newBookMaterial = new BookMaterial();
        newBookMaterial.amount = amount;
        newBookMaterial.book_id = res.id;
        newBookMaterial.material_id = id;
        newBookMaterial.book = res;
        newBookMaterial.material = material!;

        const bookMaterial: BookMaterial =
          this.bookMaterialRepository.create( newBookMaterial );

        return await this.bookMaterialRepository.save( bookMaterial );
      } ),
    );

    return res;
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne( id: number ): Promise<Book> {
    const Book = await this.bookRepository.findOneBy( { id } );

    if ( !Book ) {
      throw new HttpException(
        { message: 'Book not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return Book;
  }

  async update( id: number, updateBookDto: UpdateBookDto ): Promise<Book> {
    const toUpdate = await this.bookRepository.findOneBy( { id } );

    const { authorIds, categoryIds } = updateBookDto;

    let categories = toUpdate?.categories ?? [];
    let authors = toUpdate?.authors ?? [];

    if ( !toUpdate ) {
      throw new HttpException(
        { message: 'Book not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if ( updateBookDto.authorIds?.length ) {
      authors = await this.getAuthors( authorIds );
    }

    if ( updateBookDto.categoryIds?.length ) {
      categories = await this.getCategories( categoryIds );
    }

    toUpdate.authors = authors;
    toUpdate.categories = categories;

    Object.assign( toUpdate, updateBookDto );

    return await this.bookRepository.save( toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    try {
      return await this.bookRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }

  async getAuthors( ids: number[] ): Promise<Author[]> {
    return await Promise.all(
      ids.map( async ( id: number ) => {
        const author = await this.authorRepository.findOneBy( { id } );

        if ( !author ) {
          throw new HttpException(
            { message: `Author with id ${ id } not found` },
            HttpStatus.BAD_REQUEST,
          );
        }

        return author;
      } ),
    );
  }

  async getCategories( ids: number[] ): Promise<Category[]> {
    return await Promise.all(
      ids.map( async ( id: number ) => {
        const category = await this.categoryRepository.findOneBy( { id } );

        if ( !category ) {
          throw new HttpException(
            { message: `Category with id ${ id } not found` },
            HttpStatus.BAD_REQUEST,
          );
        }

        return category;
      } ),
    );
  }

  async getMaterials( ids: number[] ): Promise<Material[]> {
    return await Promise.all(
      ids.map( async ( id: number ) => {
        const material = await this.materialRepository.findOneBy( { id } );

        return material ?? ( {} as Material );
      } ),
    );
  }

  async checkAndProcessMaterials(
    materials: MaterialDto[],
    quantity: number,
  ): Promise<void> {
    await Promise.all(
      materials.map( async ( materialDto: { id: number; amount: number; } ) => {
        const material = await this.materialRepository.findOneBy( {
          id: materialDto.id,
        } );

        if ( !material ) {
          throw new HttpException(
            { message: `material with id ${ materialDto.id } not found` },
            HttpStatus.BAD_REQUEST,
          );
        }

        const requiredMaterialAmount = materialDto.amount * quantity;

        if ( material.amount < requiredMaterialAmount ) {
          throw new HttpException(
            { message: `Not enough materials with id ${ materialDto.id }` },
            HttpStatus.BAD_REQUEST,
          );
        }

        return material;
      } ),
    ).then( async ( materialsFromDb: Material[] ) => {
      return await Promise.all(
        materials.map( async ( materialDto: MaterialDto, id: number ) => {
          const requiredMaterialAmount = materialDto.amount * quantity;

          materialsFromDb[ id ].amount -= requiredMaterialAmount;

          return await this.materialRepository.save( materialsFromDb[ id ] );
        } ),
      );
    } );
  }
}
