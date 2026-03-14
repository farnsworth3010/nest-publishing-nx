import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { CreateBookMaterialDto } from '@app/contracts/book-material/create-book-material.dto';
import { UpdateBookMaterialDto } from '@app/contracts/book-material/update-book-material.dto';
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
import { BookMaterialService } from './book-material.service';

@ApiTags( 'book-material' )
@Controller( 'book-material' )
export class BookMaterialController {
  constructor( private readonly bookMaterialService: BookMaterialService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: BookMaterial } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create(
    @Body() createBookMaterialDto: CreateBookMaterialDto,
  ): Observable<BookMaterial> {
    return this.bookMaterialService.create( createBookMaterialDto );
  }

  @Get()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, AuthGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: BookMaterial, isArray: true } )
  findAll(): Observable<BookMaterial[]> {
    return this.bookMaterialService.findAll();
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'BookMaterial ID' } )
  @ApiOkResponse( { type: BookMaterial } )
  @ApiNotFoundResponse( { description: 'BookMaterial not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<BookMaterial> {
    return this.bookMaterialService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'BookMaterial ID' } )
  @ApiOkResponse( { description: 'BookMaterial updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update(
    @Param( 'id' ) id: string,
    @Body() updateBookMaterialDto: UpdateBookMaterialDto,
  ): Observable<UpdateResult> {
    return this.bookMaterialService.update( +id, updateBookMaterialDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'BookMaterial ID' } )
  @ApiOkResponse( { description: 'BookMaterial deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.bookMaterialService.remove( +id );
  }
}
