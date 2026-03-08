import { Book } from '@app/contracts/book/book.entity';
import { Office } from '@app/contracts/office/office.entity';
import { CreateSaleDto } from '@app/contracts/sale/create-sale.dto';
import { Sale } from '@app/contracts/sale/sale.entity';
import { UpdateSaleDto } from '@app/contracts/sale/update-sale.dto';
import { User } from '@app/contracts/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository( Sale ) private saleRepository: Repository<Sale>,
    @InjectRepository( User ) private userRepository: Repository<User>,
    @InjectRepository( Office ) private officeRepository: Repository<Office>,
    @InjectRepository( Book ) private bookRepository: Repository<Book>,
  ) { }

  async create( createSaleDto: CreateSaleDto ): Promise<Sale> {
    const user = await this.userRepository.findOneBy( { id: createSaleDto.userId } );

    if ( !user ) {
      throw new HttpException( { message: 'User not found' }, HttpStatus.BAD_REQUEST );
    }

    const office = await this.officeRepository.findOneBy( { id: createSaleDto.officeId } );

    if ( !office ) {
      throw new HttpException( { message: 'Office not found' }, HttpStatus.BAD_REQUEST );
    }

    const book = await this.bookRepository.findOneBy( { id: createSaleDto.bookId } );

    if ( !book ) {
      throw new HttpException( { message: 'Book not found' }, HttpStatus.BAD_REQUEST );
    }

    if ( book.quantity < createSaleDto.amount ) {
      throw new HttpException( { message: 'Not enough books' }, HttpStatus.BAD_REQUEST );
    }

    book.quantity -= createSaleDto.amount;

    await this.bookRepository.save( book );

    const sale = this.saleRepository.create( createSaleDto );

    return await this.saleRepository.save( sale );
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find();
  }

  async findOne( id: number ): Promise<Sale> {
    const sale = await this.saleRepository.findOneBy( { id } );

    if ( !sale ) {
      throw new HttpException( { message: 'sale not found' }, HttpStatus.NOT_FOUND );
    }

    return sale;
  }

  async update( id: number, updateSaleDto: UpdateSaleDto ): Promise<Sale> {
    const toUpdate = await this.saleRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'sale not found' }, HttpStatus.NOT_FOUND );
    }

    return await Object.assign( toUpdate, updateSaleDto );
  }

  async remove( id: number ): Promise<DeleteResult> {
    return await this.saleRepository.delete( { id } );
  }
}
