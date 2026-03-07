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
import { BookMaterialService } from './book-material.service';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { UserRole } from '@app/contracts/user/user.interface';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { CreateBookMaterialDto } from '@app/contracts/book-material/create-book-material.dto';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { UpdateBookMaterialDto } from '@app/contracts/book-material/update-book-material.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Observable } from 'rxjs';

@Controller('book-material')
export class BookMaterialController {
  constructor(private readonly bookMaterialService: BookMaterialService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body() createBookMaterialDto: CreateBookMaterialDto,
  ): Observable<BookMaterial> {
    return this.bookMaterialService.create(createBookMaterialDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, AuthGuard)
  findAll(): Observable<BookMaterial[]> {
    return this.bookMaterialService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Observable<BookMaterial> {
    return this.bookMaterialService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateBookMaterialDto: UpdateBookMaterialDto,
  ): Observable<UpdateResult> {
    return this.bookMaterialService.update(+id, updateBookMaterialDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.bookMaterialService.remove(+id);
  }
}
