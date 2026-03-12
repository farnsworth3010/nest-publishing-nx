import { Author } from '@app/contracts/author/author.entity';
import { AUTHOR_PATTERNS } from '@app/contracts/author/author.pattern';
import { News } from '@app/contracts/news/news.entity';
import { CreateAuthorDto } from '@app/contracts/author/create-author.dto';
import { UpdateAuthorDto } from '@app/contracts/author/update-author.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthorService } from './author.service';

@Controller()
export class AuthorController {
  constructor( private readonly authorService: AuthorService ) { }

  @MessagePattern( AUTHOR_PATTERNS.CREATE )
  create( @Payload() createAuthorDto: CreateAuthorDto ): Promise<Author> {
    return this.authorService.create( createAuthorDto );
  }

  @MessagePattern( AUTHOR_PATTERNS.FIND_ALL )
  findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @MessagePattern( AUTHOR_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Author> {
    return this.authorService.findOne( id );
  }

  @MessagePattern( AUTHOR_PATTERNS.FIND_NEWS_BY_WRITER )
  findNewsByWriter( @Payload() writerId: number ): Promise<News[]> {
    return this.authorService.findNewsByWriter( writerId );
  }

  @MessagePattern( AUTHOR_PATTERNS.UPDATE )
  update( @Payload() { id, updateAuthorDto }: { id: number; updateAuthorDto: UpdateAuthorDto; } ): Promise<UpdateResult> {
    return this.authorService.update( id, updateAuthorDto );
  }

  @MessagePattern( AUTHOR_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.authorService.remove( id );
  }
}
