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
import { AuthorService } from './author.service';
import { UserRole } from '@app/contracts/user/user.interface';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { CreateAuthorDto } from '@app/contracts/author/create-author.dto';
import { Author } from '@app/contracts/author/author.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateAuthorDto } from '@app/contracts/author/update-author.dto';
import { Observable } from 'rxjs';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createAuthorDto: CreateAuthorDto): Observable<Author> {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findAll(): Observable<Author[]> {
    return this.authorService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string): Observable<Author> {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Observable<UpdateResult> {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.authorService.remove(+id);
  }
}
