import { CreateSaleDto } from '@app/contracts/sale/create-sale.dto';
import { Sale } from '@app/contracts/sale/sale.entity';
import { SALE_PATTERNS } from '@app/contracts/sale/sale.pattern';
import { UpdateSaleDto } from '@app/contracts/sale/update-sale.dto';
import { SALE_CLIENT } from '@app/gateway/constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class SaleService {
  constructor( @Inject( SALE_CLIENT ) private readonly client: ClientProxy ) { }

  create( createSaleDto: CreateSaleDto ): Observable<Sale> {
    return this.client.send( SALE_PATTERNS.CREATE, createSaleDto );
  }

  findAll(): Observable<Sale[]> {
    return this.client.send( SALE_PATTERNS.FIND_ALL, {} );
  }

  findOne( id: number ): Observable<Sale> {
    return this.client.send( SALE_PATTERNS.FIND_ONE, id );
  }

  update( id: number, updateSaleDto: UpdateSaleDto ): Observable<UpdateResult> {
    return this.client.send( SALE_PATTERNS.UPDATE, { id, updateSaleDto } );
  }

  remove( id: number ): Observable<DeleteResult> {
    return this.client.send( SALE_PATTERNS.REMOVE, id );
  }
}
