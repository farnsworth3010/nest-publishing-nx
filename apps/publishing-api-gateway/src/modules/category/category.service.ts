import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_CLIENT } from '@app/gateway/constant';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDto } from '@app/contracts/category/create-category.dto';
import { UpdateCategoryDto } from '@app/contracts/category/update-category.dto';
import { CATEGORY_PATTERNS } from '@app/contracts/category/category.pattern';
import { Observable } from 'rxjs';
import { Category } from '@app/contracts/category/category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@Inject(CATEGORY_CLIENT) private categoryClient: ClientProxy) {}

  create(createCategoryDto: CreateCategoryDto): Observable<Category> {
    return this.categoryClient.send(
      CATEGORY_PATTERNS.CREATE,
      createCategoryDto,
    );
  }

  findAll(): Observable<Category[]> {
    return this.categoryClient.send(CATEGORY_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<Category> {
    return this.categoryClient.send(CATEGORY_PATTERNS.FIND_ONE, id);
  }

  update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Observable<UpdateResult> {
    return this.categoryClient.send(CATEGORY_PATTERNS.UPDATE, {
      id,
      updateCategoryDto,
    });
  }

  remove(id: number): Observable<DeleteResult> {
    return this.categoryClient.send(CATEGORY_PATTERNS.REMOVE, id);
  }
}
