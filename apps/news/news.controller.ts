import { CreateNewsDto } from '@app/contracts/news/create-news.dto';
import { News } from '@app/contracts/news/news.entity';
import { NEWS_PATTERNS } from '@app/contracts/news/news.pattern';
import { UpdateNewsDto } from '@app/contracts/news/update-news.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NewsService } from './news.service';

@Controller()
export class NewsController {
  constructor( private readonly newsService: NewsService ) { }

  @MessagePattern( NEWS_PATTERNS.CREATE )
  create( @Payload() createNewsDto: CreateNewsDto ): Promise<News> {
    return this.newsService.create( createNewsDto );
  }

  @MessagePattern( NEWS_PATTERNS.FIND_ALL )
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @MessagePattern( NEWS_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<News> {
    return this.newsService.findOne( id );
  }

  @MessagePattern( NEWS_PATTERNS.UPDATE )
  update( @Payload() { id, updateNewsDto }: { id: number; updateNewsDto: UpdateNewsDto; } ): Promise<UpdateResult> {
    return this.newsService.update( id, updateNewsDto );
  }

  @MessagePattern( NEWS_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.newsService.remove( id );
  }
}
