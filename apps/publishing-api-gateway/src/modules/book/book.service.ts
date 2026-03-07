import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOOK_CLIENT } from '../../constant';
import { BOOK_PATTERNS } from '@app/contracts/book/book.pattern';
import { CreateBookDto } from '@app/contracts/book/create-book.dto';
import { UpdateBookDto } from '@app/contracts/book/update-book.dto';
import { Observable } from 'rxjs';
import { Book } from '@app/contracts/book/book.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class BookService {
  constructor(@Inject(BOOK_CLIENT) private bookClient: ClientProxy) {}

  create(createBookDto: CreateBookDto): Observable<Book> {
    return this.bookClient.send(BOOK_PATTERNS.CREATE, createBookDto);
  }

  findAll(): Observable<Book[]> {
    return this.bookClient.send(BOOK_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<Book> {
    return this.bookClient.send(BOOK_PATTERNS.FIND_ONE, id);
  }

  update(id: number, updateBookDto: UpdateBookDto): Observable<Book> {
    return this.bookClient.send(BOOK_PATTERNS.UPDATE, { id, updateBookDto });
  }

  remove(id: number): Observable<DeleteResult> {
    return this.bookClient.send(BOOK_PATTERNS.REMOVE, id);
  }
}
