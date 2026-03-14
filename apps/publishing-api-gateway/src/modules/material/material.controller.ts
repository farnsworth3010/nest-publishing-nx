import { CreateMaterialDto } from '@app/contracts/material/create-material.dto';
import { Material } from '@app/contracts/material/material.entity';
import { UpdateMaterialDto } from '@app/contracts/material/update-material.dto';
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
import { MaterialService } from './material.service';

@ApiTags( 'material' )
@Controller( 'material' )
export class MaterialController {
  constructor( private readonly materialService: MaterialService ) { }

  @Post()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Material } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  create( @Body() createMaterialDto: CreateMaterialDto ): Observable<Material> {
    return this.materialService.create( createMaterialDto );
  }

  @Get()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Material, isArray: true } )
  findAll(): Observable<Material[]> {
    return this.materialService.findAll();
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Material ID' } )
  @ApiOkResponse( { type: Material } )
  @ApiNotFoundResponse( { description: 'Material not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Material> {
    return this.materialService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Material ID' } )
  @ApiOkResponse( { description: 'Material updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  update(
    @Param( 'id' ) id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Observable<UpdateResult> {
    return this.materialService.update( +id, updateMaterialDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Material ID' } )
  @ApiOkResponse( { description: 'Material deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.materialService.remove( +id );
  }
}
