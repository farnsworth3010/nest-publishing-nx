import { CreateOfficeDto } from '@app/contracts/office/create-office.dto';
import { Office } from '@app/contracts/office/office.entity';
import { UpdateOfficeDto } from '@app/contracts/office/update-office.dto';
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
import { OfficeService } from './office.service';

@ApiTags( 'office' )
@Controller( 'office' )
export class OfficeController {
  constructor( private readonly officeService: OfficeService ) { }

  @Post()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Office } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )

  create( @Body() createOfficeDto: CreateOfficeDto ): Observable<Office> {
    return this.officeService.create( createOfficeDto );
  }

  @Get()
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Office, isArray: true } )
  findAll(): Observable<Office[]> {
    return this.officeService.findAll();
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Office ID' } )
  @ApiOkResponse( { type: Office } )
  @ApiNotFoundResponse( { description: 'Office not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Office> {
    return this.officeService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Office ID' } )
  @ApiOkResponse( { description: 'Office updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )

  update(
    @Param( 'id' ) id: string,
    @Body() updateOfficeDto: UpdateOfficeDto,
  ): Observable<UpdateResult> {
    return this.officeService.update( +id, updateOfficeDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Office ID' } )
  @ApiOkResponse( { description: 'Office deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id' ) id: string ): Observable<DeleteResult> {
    return this.officeService.remove( +id );
  }
}
