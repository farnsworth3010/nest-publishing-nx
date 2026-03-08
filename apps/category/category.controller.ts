import { Category } from '@app/contracts/category/category.entity';
import { CATEGORY_PATTERNS } from '@app/contracts/category/category.pattern';
import { CreateCategoryDto } from '@app/contracts/category/create-category.dto';
import { UpdateCategoryDto } from '@app/contracts/category/update-category.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor( private readonly categoryService: CategoryService ) { }

  @MessagePattern( CATEGORY_PATTERNS.CREATE )
  create( @Payload() createCategoryDto: CreateCategoryDto ): Promise<Category> {
    return this.categoryService.create( createCategoryDto );
  }

  @MessagePattern( CATEGORY_PATTERNS.FIND_ALL )
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @MessagePattern( CATEGORY_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Category> {
    return this.categoryService.findOne( id );
  }

  @MessagePattern( CATEGORY_PATTERNS.UPDATE )
  update( @Payload() { id, updateCategoryDto }: { id: number; updateCategoryDto: UpdateCategoryDto; } ): Promise<any> {
    return this.categoryService.update( id, updateCategoryDto );
  }

  @MessagePattern( CATEGORY_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.categoryService.remove( id );
  }
}
