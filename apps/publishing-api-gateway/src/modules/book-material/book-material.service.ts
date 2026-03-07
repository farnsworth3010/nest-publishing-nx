import { Inject, Injectable } from '@nestjs/common';
import { BOOK_MATERIAL_CLIENT } from '@app/gateway/constant';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookMaterialDto } from '@app/contracts/book-material/create-book-material.dto';
import { BOOK_MATERIAL_PATTERNS } from '@app/contracts/book-material/book-material.pattern';
import { UpdateBookMaterialDto } from '@app/contracts/book-material/update-book-material.dto';
import { Observable } from 'rxjs';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class BookMaterialService {
  constructor(
    @Inject(BOOK_MATERIAL_CLIENT) private bookMaterialClient: ClientProxy,
  ) {}

  create(
    createBookMaterialDto: CreateBookMaterialDto,
  ): Observable<BookMaterial> {
    return this.bookMaterialClient.send(
      BOOK_MATERIAL_PATTERNS.CREATE,
      createBookMaterialDto,
    );
  }

  findAll(): Observable<BookMaterial[]> {
    return this.bookMaterialClient.send(BOOK_MATERIAL_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<BookMaterial> {
    return this.bookMaterialClient.send(BOOK_MATERIAL_PATTERNS.FIND_ONE, id);
  }

  update(
    id: number,
    updateBookMaterialDto: UpdateBookMaterialDto,
  ): Observable<UpdateResult> {
    return this.bookMaterialClient.send(BOOK_MATERIAL_PATTERNS.UPDATE, {
      id,
      updateBookMaterialDto,
    });
  }

  remove(id: number): Observable<DeleteResult> {
    return this.bookMaterialClient.send(BOOK_MATERIAL_PATTERNS.REMOVE, id);
  }
}
