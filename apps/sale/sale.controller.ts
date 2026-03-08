import { CreateSaleDto } from '@app/contracts/sale/create-sale.dto';
import { Sale } from '@app/contracts/sale/sale.entity';
import { SALE_PATTERNS } from '@app/contracts/sale/sale.pattern';
import { UpdateSaleDto } from '@app/contracts/sale/update-sale.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { SaleService } from './sale.service';

@Controller()
export class SaleController {
  constructor( private readonly saleService: SaleService ) { }

  @MessagePattern( SALE_PATTERNS.CREATE )
  create( @Payload() createSaleDto: CreateSaleDto ): Promise<Sale> {
    return this.saleService.create( createSaleDto );
  }

  @MessagePattern( SALE_PATTERNS.FIND_ALL )
  findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @MessagePattern( SALE_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Sale> {
    return this.saleService.findOne( id );
  }

  @MessagePattern( SALE_PATTERNS.UPDATE )
  update( @Payload() { id, updateSaleDto }: { id: number; updateSaleDto: UpdateSaleDto; } ): Promise<Sale> {
    return this.saleService.update( id, updateSaleDto );
  }

  @MessagePattern( SALE_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.saleService.remove( id );
  }
}
