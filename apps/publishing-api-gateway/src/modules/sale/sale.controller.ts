import { CreateSaleDto } from '@app/contracts/sale/create-sale.dto';
import { Sale } from '@app/contracts/sale/sale.entity';
import { UpdateSaleDto } from '@app/contracts/sale/update-sale.dto';
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
    ParseIntPipe,
    Patch,
    Post,
    Query,
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
import { SaleService } from './sale.service';

@ApiTags( 'sale' )
@Controller( 'sale' )
export class SaleController {
  constructor( private readonly saleService: SaleService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES, UserRole.CLIENT )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiCreatedResponse( { type: Sale } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )

  create( @Body() createSaleDto: CreateSaleDto ): Observable<Sale> {
    return this.saleService.create( createSaleDto );
  }

  @Get()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { type: Sale, isArray: true } )
  findAll(): Observable<Sale[]> {
    return this.saleService.findAll();
  }

  @Post( 'calendar' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { description: 'All sales added to Google Calendar' } )
  addToCalendar(): Observable<any> {
    return this.saleService.addToCalendar();
  }

  @Get( 'calendar' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { description: 'Google Calendar events for the given period' } )
  getCalendarEvents(
    @Query( 'startDate' ) startDate: string,
    @Query( 'endDate' ) endDate: string,
  ): Observable<any> {
    return this.saleService.getCalendarEvents( startDate, endDate );
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Sale ID' } )
  @ApiOkResponse( { type: Sale } )
  @ApiNotFoundResponse( { description: 'Sale not found' } )
  findOne( @Param( 'id' ) id: string ): Observable<Sale> {
    return this.saleService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Sale ID' } )
  @ApiOkResponse( { description: 'Sale updated' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )

  update(
    @Param( 'id', new ParseIntPipe() ) id: number,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Observable<UpdateResult> {
    return this.saleService.update( id, updateSaleDto );
  }

  @Delete( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam( { name: 'id', type: 'integer', description: 'Sale ID' } )
  @ApiOkResponse( { description: 'Sale deleted' } )
  @ApiUnauthorizedResponse( { description: 'Unauthorized' } )
  @ApiForbiddenResponse( { description: 'Forbidden' } )
  remove( @Param( 'id', new ParseIntPipe() ) id: number ): Observable<DeleteResult> {
    return this.saleService.remove( id );
  }

  @Post( 'export/docs' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiOkResponse( { description: 'Google Docs document URL with sales report' } )
  exportToDocs(
    @Query( 'startDate' ) startDate: string,
    @Query( 'endDate' ) endDate: string,
  ): Observable<any> {
    return this.saleService.exportToDocs( startDate, endDate );
  }
}
