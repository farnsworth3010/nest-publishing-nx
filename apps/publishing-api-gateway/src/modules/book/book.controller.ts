import { Book } from '@app/contracts/book/book.entity';
import { CreateBookDto } from '@app/contracts/book/create-book.dto';
import { UpdateBookDto } from '@app/contracts/book/update-book.dto';
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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { BookService } from './book.service';

@ApiTags( 'book' )
@Controller( 'book' )
export class BookController {
  constructor( private readonly BookService: BookService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Book } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create( @Body() createBookDto: CreateBookDto ): Observable<Book> {
    return this.BookService.create( createBookDto );
  }

  @Get()
  @Roles( UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Book, isArray: true } )
  findAll(): Observable<Book[]> {
    return this.BookService.findAll();
  }

  @Get( ':id' )
  @Roles( UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Book ID' } )
  @ApiOkResponse( { type: Book } )
  @ApiNotFoundResponse( { description: 'Book not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Book> {
    return this.BookService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Book ID' } )
  @ApiOkResponse( { type: Book } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update(
    @Param( 'id' ) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Observable<Book> {
    return this.BookService.update( +id, updateBookDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Book ID' } )
  @ApiOkResponse( { description: 'Book deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.BookService.remove( +id );
  }

  @Post('export/sheets')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  exportToSheets(): Observable<any> {
    return this.BookService.exportToSheets();
  }

  @Get(':id/price/:currency')
  @Roles(UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID' })
  @ApiParam({ name: 'currency', type: 'string', description: 'Target currency abbreviation (e.g. USD, EUR, RUB)' })
  getPriceInCurrency(
    @Param('id') id: string,
    @Param('currency') currency: string,
  ): Observable<any> {
    return this.BookService.getPriceInCurrency(+id, currency.toUpperCase());
  }
}
