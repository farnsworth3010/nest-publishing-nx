import { Author } from '@app/contracts/author/author.entity';
import { CreateAuthorDto } from '@app/contracts/author/create-author.dto';
import { UpdateAuthorDto } from '@app/contracts/author/update-author.dto';
import { News } from '@app/contracts/news/news.entity';
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
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthorService } from './author.service';

@ApiTags( 'author' )
@Controller( 'author' )
export class AuthorController {
  constructor( private readonly authorService: AuthorService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Author } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create( @Body() createAuthorDto: CreateAuthorDto ): Observable<Author> {
    return this.authorService.create( createAuthorDto );
  }

  @Get()
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Author, isArray: true } )
  findAll(): Observable<Author[]> {
    return this.authorService.findAll();
  }

  @Get( ':id' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Author ID' } )
  @ApiOkResponse( { type: Author } )
  @ApiNotFoundResponse( { description: 'Author not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Author> {
    return this.authorService.findOne( +id );
  }

  @Get( ':id/news' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Author ID' } )
  @ApiOkResponse( { type: News, isArray: true } )
  findNews( @Param( 'id' ) id: string ): Observable<News[]> {
    return this.authorService.findNewsByWriter( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Author ID' } )
  @ApiOkResponse( { description: 'Author updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update(
    @Param( 'id' ) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Observable<UpdateResult> {
    return this.authorService.update( +id, updateAuthorDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Author ID' } )
  @ApiOkResponse( { description: 'Author deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.authorService.remove( +id );
  }
}
