import { CreateNewsDto } from '@app/contracts/news/create-news.dto';
import { News } from '@app/contracts/news/news.entity';
import { UpdateNewsDto } from '@app/contracts/news/update-news.dto';
import { UserRole } from '@app/contracts/user/user.interface';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NewsService } from './news.service';

@Controller( 'news' )
export class NewsController {
  constructor( private readonly newsService: NewsService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  create( @Body() createNewsDto: CreateNewsDto ): Observable<News> {
    return this.newsService.create( createNewsDto );
  }

  @Get()
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  findAll(): Observable<News[]> {
    return this.newsService.findAll();
  }

  @Get( ':id' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  findOne( @Param( 'id' ) id: string ): Observable<News> {
    return this.newsService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  update( @Param( 'id' ) id: string, @Body() updateNewsDto: UpdateNewsDto ): Observable<UpdateResult> {
    return this.newsService.update( +id, updateNewsDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.newsService.remove( +id );
  }
}
