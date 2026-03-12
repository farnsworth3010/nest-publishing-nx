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
import { BookService } from './book.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from '@app/contracts/book/create-book.dto';
import { UpdateBookDto } from '@app/contracts/book/update-book.dto';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { UserRole } from '@app/contracts/user/user.interface';
import { Book } from '@app/contracts/book/book.entity';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly BookService: BookService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createBookDto: CreateBookDto): Observable<Book> {
    return this.BookService.create(createBookDto);
  }

  @Get()
  @Roles(UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  findAll(): Observable<Book[]> {
    return this.BookService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID' })
  findOne(@Param('id') id: string): Observable<Book> {
    return this.BookService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID' })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Observable<Book> {
    return this.BookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID' })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.BookService.remove(+id);
  }
}
