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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { NewsService } from './news.service';

@ApiTags( 'news' )
@Controller( 'news' )
export class NewsController {
  constructor( private readonly newsService: NewsService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: News } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create( @Body() createNewsDto: CreateNewsDto ): Observable<News> {
    return this.newsService.create( createNewsDto );
  }

  @Get()
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: News, isArray: true } )
  findAll(): Observable<News[]> {
    return this.newsService.findAll();
  }

  @Get( ':id' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'News ID' } )
  @ApiOkResponse( { type: News } )
  @ApiNotFoundResponse( { description: 'News not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<News> {
    return this.newsService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'News ID' } )
  @ApiOkResponse( { description: 'News updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update( @Param( 'id' ) id: string, @Body() updateNewsDto: UpdateNewsDto ): Observable<News> {
    return this.newsService.update( +id, updateNewsDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'News ID' } )
  @ApiOkResponse( { description: 'News deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.newsService.remove( +id );
  }
}
