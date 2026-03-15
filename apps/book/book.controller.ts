import { Book } from '@app/contracts/book/book.entity';
import { BOOK_PATTERNS } from '@app/contracts/book/book.pattern';
import { CreateBookDto } from '@app/contracts/book/create-book.dto';
import { UpdateBookDto } from '@app/contracts/book/update-book.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { BookService } from './book.service';

@Controller()
export class BookController {
  constructor( private readonly bookService: BookService ) { }

  @MessagePattern( BOOK_PATTERNS.CREATE )
  create( @Payload() createBookDto: CreateBookDto ): Promise<Book> {
    return this.bookService.create( createBookDto );
  }

  @MessagePattern( BOOK_PATTERNS.FIND_ALL )
  findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @MessagePattern( BOOK_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Book> {
    return this.bookService.findOne( id );
  }

  @MessagePattern( BOOK_PATTERNS.UPDATE )
  update(
    @Payload()
    { id, updateBookDto }: { id: number; updateBookDto: UpdateBookDto; },
  ): Promise<Book> {
    return this.bookService.update( id, updateBookDto );
  }

  @MessagePattern( BOOK_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.bookService.remove( id );
  }
}
