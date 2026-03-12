import { Inject, Injectable } from '@nestjs/common';
import { AUTHOR_CLIENT } from '@app/gateway/constant';
import { ClientProxy } from '@nestjs/microservices';
import { AUTHOR_PATTERNS } from '@app/contracts/author/author.pattern';
import { UpdateAuthorDto } from '@app/contracts/author/update-author.dto';
import { CreateAuthorDto } from '@app/contracts/author/create-author.dto';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Author } from '@app/contracts/author/author.entity';

@Injectable()
export class AuthorService {
  constructor(@Inject(AUTHOR_CLIENT) private authorClient: ClientProxy) {}

  create(createAuthorDto: CreateAuthorDto): Observable<Author> {
    return this.authorClient.send(AUTHOR_PATTERNS.CREATE, createAuthorDto);
  }

  findAll(): Observable<Author[]> {
    return this.authorClient.send(AUTHOR_PATTERNS.FIND_ALL, {});
  }

    findOne(id: number): Observable<Author> {
      return this.authorClient.send(AUTHOR_PATTERNS.FIND_ONE, id);
    }

  update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
  ): Observable<UpdateResult> {
    return this.authorClient.send(AUTHOR_PATTERNS.UPDATE, {
      id,
      updateAuthorDto,
    });
  }

  remove(id: number): Observable<DeleteResult> {
    return this.authorClient.send(AUTHOR_PATTERNS.REMOVE, id);
  }

  findNewsByWriter(id: number): Observable<import('@app/contracts/news/news.entity').News[]> {
    return this.authorClient.send(AUTHOR_PATTERNS.FIND_NEWS_BY_WRITER, id);
  }
}
