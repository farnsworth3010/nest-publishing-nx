import { CreateSaleDto } from '@app/contracts/sale/create-sale.dto';
import { Sale } from '@app/contracts/sale/sale.entity';
import { UpdateSaleDto } from '@app/contracts/sale/update-sale.dto';
import { UserRole } from '@app/contracts/user/user.interface';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { ApiBearerAuth,  ApiParam, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SaleService } from './sale.service';

@ApiTags('sale')
@Controller( 'sale' )
export class SaleController {
  constructor( private readonly saleService: SaleService ) { }

  @Post()
  @Roles( UserRole.ADMIN, UserRole.SALES, UserRole.CLIENT )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  
  create( @Body() createSaleDto: CreateSaleDto ): Observable<Sale> {
    return this.saleService.create( createSaleDto );
  }

  @Get()
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  findAll(): Observable<Sale[]> {
    return this.saleService.findAll();
  }

  @Get( ':id' )
  @Roles( UserRole.ADMIN, UserRole.SALES )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Sale ID' })
  findOne( @Param( 'id' ) id: string ): Observable<Sale> {
    return this.saleService.findOne( +id );
  }

  @Patch( ':id' )
  @Roles( UserRole.ADMIN )
  @UseGuards( AuthGuard, RolesGuard )
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Sale ID' })
  
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
  @ApiParam({ name: 'id', type: 'integer', description: 'Sale ID' })
  remove( @Param( 'id', new ParseIntPipe() ) id: number ): Observable<DeleteResult> {
    return this.saleService.remove( id );
  }
}
