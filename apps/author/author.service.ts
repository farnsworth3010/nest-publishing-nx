import { Author } from '@app/contracts/author/author.entity';
import { CreateAuthorDto } from '@app/contracts/author/create-author.dto';
import { UpdateAuthorDto } from '@app/contracts/author/update-author.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NEWS_CLIENT } from '@app/gateway/constant';
import { NEWS_PATTERNS } from '@app/contracts/news/news.pattern';
import { News } from '@app/contracts/news/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository( Author ) private authorRepository: Repository<Author>,
    @Inject( NEWS_CLIENT ) private newsClient: ClientProxy,
  ) { }

  async create( createAuthorDto: CreateAuthorDto ): Promise<Author> {
    const author = this.authorRepository.create( createAuthorDto );

    return await this.authorRepository.save( author );
  }

  async findAll(): Promise<Author[]> {
    return await this.authorRepository.find();
  }

  async findOne( id: number ): Promise<Author> {
    const author = await this.authorRepository.findOneBy( { id } );

    if ( !author ) {
      throw new HttpException( { message: 'Author not found' }, HttpStatus.NOT_FOUND );
    }

    return author;
  }

  async update( id: number, updateAuthorDto: UpdateAuthorDto ): Promise<UpdateResult> {
    const toUpdate = await this.authorRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'author not found' }, HttpStatus.NOT_FOUND );
    }

    Object.assign( toUpdate, updateAuthorDto );

    return this.authorRepository.update( { id }, toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    return await this.authorRepository.delete( { id } );
  }

  async findNewsByWriter( writerId: number ): Promise<News[]> {
    const news = await firstValueFrom( this.newsClient.send<News[], number>( NEWS_PATTERNS.FIND_BY_WRITER, writerId ) );

    return news ?? [];
  }
}
