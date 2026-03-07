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
import { CategoryService } from './category.service';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { UserRole } from '@app/contracts/user/user.interface';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { Category } from '@app/contracts/category/category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from '@app/contracts/category/update-category.dto';
import { CreateCategoryDto } from '@app/contracts/category/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto): Observable<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Observable<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string): Observable<Category> {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<UpdateResult> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.categoryService.remove(+id);
  }
}
