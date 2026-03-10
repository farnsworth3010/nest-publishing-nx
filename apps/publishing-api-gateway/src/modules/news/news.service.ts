import { CreateNewsDto } from '@app/contracts/news/create-news.dto';
import { News } from '@app/contracts/news/news.entity';
import { NEWS_PATTERNS } from '@app/contracts/news/news.pattern';
import { UpdateNewsDto } from '@app/contracts/news/update-news.dto';
import { NEWS_CLIENT } from '@app/gateway/constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class NewsService {
  constructor( @Inject( NEWS_CLIENT ) private newsClient: ClientProxy ) { }

  create( createNewsDto: CreateNewsDto ): Observable<News> {
    return this.newsClient.send<News, CreateNewsDto>( NEWS_PATTERNS.CREATE, createNewsDto );
  }

  findAll(): Observable<News[]> {
    return this.newsClient.send<News[], {}>( NEWS_PATTERNS.FIND_ALL, {} );
  }

  findOne( id: number ): Observable<News> {
    return this.newsClient.send<News, number>( NEWS_PATTERNS.FIND_ONE, id );
  }

  update( id: number, updateNewsDto: UpdateNewsDto ): Observable<UpdateResult> {
    return this.newsClient.send<UpdateResult, { id: number; updateNewsDto: UpdateNewsDto; }>(
      NEWS_PATTERNS.UPDATE,
      {
        id,
        updateNewsDto,
      },
    );
  }

  remove( id: number ): Observable<DeleteResult> {
    return this.newsClient.send<DeleteResult, number>( NEWS_PATTERNS.REMOVE, id );
  }
}
