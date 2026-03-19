import { handleTypeOrmError } from '@app/common/db-error.util';
import { Author } from '@app/contracts/author/author.entity';
import { CreateNewsDto } from '@app/contracts/news/create-news.dto';
import { News } from '@app/contracts/news/news.entity';
import { UpdateNewsDto } from '@app/contracts/news/update-news.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository( News ) private newsRepository: Repository<News>,
    @InjectRepository( Author ) private authorRepository: Repository<Author>,
  ) { }

  async create( createNewsDto: CreateNewsDto ): Promise<News> {
    const news = this.newsRepository.create( createNewsDto as Partial<News> );

    if ( createNewsDto.writerId ) {
      const author = await this.authorRepository.findOneBy( { id: createNewsDto.writerId } );
      if ( !author ) {
        throw new HttpException( { message: 'Author not found' }, HttpStatus.NOT_FOUND );
      }
      news.writer = author;
    }

    const res = await this.newsRepository.save( news );
    if ( Array.isArray( res ) ) return res[ 0 ];
    return res;
  }

  async findAll(): Promise<News[]> {
    return await this.newsRepository.find();
  }

  async findByWriter( writerId: number ): Promise<News[]> {
    return await this.newsRepository
      .createQueryBuilder( 'news' )
      .leftJoinAndSelect( 'news.writer', 'writer' )
      .where( 'writer.id = :writerId', { writerId } )
      .getMany();
  }

  async findOne( id: number ): Promise<News> {
    const news = await this.newsRepository.findOneBy( { id } );

    if ( !news ) {
      throw new HttpException( { message: 'News not found' }, HttpStatus.NOT_FOUND );
    }

    return news;
  }

  async update( id: number, updateNewsDto: UpdateNewsDto ): Promise<News> {
    const toUpdate = await this.newsRepository.findOneBy( { id } );

    if ( !toUpdate ) {
      throw new HttpException( { message: 'news not found' }, HttpStatus.NOT_FOUND );
    }

    if ( updateNewsDto.writerId !== undefined ) {
      if ( updateNewsDto.writerId ) {
        const author = await this.authorRepository.findOneBy( { id: updateNewsDto.writerId } );
        if ( !author ) {
          throw new HttpException( { message: 'Author not found' }, HttpStatus.NOT_FOUND );
        }
        toUpdate.writer = author;
      } else {
        toUpdate.writer = undefined;
      }
    }

    // Assign other fields, excluding writerId
    const { writerId, ...otherFields } = updateNewsDto;
    Object.assign( toUpdate, otherFields as Partial<News> );

    return await this.newsRepository.save( toUpdate );
  }

  async remove( id: number ): Promise<DeleteResult> {
    try {
      return await this.newsRepository.delete( { id } );
    } catch ( error ) {
      handleTypeOrmError( error );
    }
  }
}
