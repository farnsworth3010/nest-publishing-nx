import { Category } from '@app/contracts/category/category.entity';
import { CreateCategoryDto } from '@app/contracts/category/create-category.dto';
import { UpdateCategoryDto } from '@app/contracts/category/update-category.dto';
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
import { CategoryService } from './category.service';

@ApiTags( 'category' )
@Controller( 'category' )
export class CategoryController {
  constructor( private readonly categoryService: CategoryService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Category } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create( @Body() createCategoryDto: CreateCategoryDto ): Observable<Category> {
    return this.categoryService.create( createCategoryDto );
  }

  @Get()
  @Roles( UserRole.SALES, UserRole.ADMIN, UserRole.CLIENT )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Category, isArray: true } )
  findAll(): Observable<Category[]> {
    return this.categoryService.findAll();
  }

  @Get( ':id' )
  @UseGuards( AuthGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Category ID' } )
  @ApiOkResponse( { type: Category } )
  @ApiNotFoundResponse( { description: 'Category not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Category> {
    return this.categoryService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Category ID' } )
  @ApiOkResponse( { description: 'Category updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update(
    @Param( 'id' ) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<UpdateResult> {
    return this.categoryService.update( +id, updateCategoryDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Category ID' } )
  @ApiOkResponse( { description: 'Category deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.categoryService.remove( +id );
  }
}
