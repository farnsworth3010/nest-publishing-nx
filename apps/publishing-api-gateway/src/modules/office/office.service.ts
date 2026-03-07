import { CreateOfficeDto } from '@app/contracts/office/create-office.dto';
import { Office } from '@app/contracts/office/office.entity';
import { OFFICE_PATTERNS } from '@app/contracts/office/office.pattern';
import { UpdateOfficeDto } from '@app/contracts/office/update-office.dto';
import { OFFICE_CLIENT } from '@app/gateway/constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class OfficeService {
  constructor( @Inject( OFFICE_CLIENT ) private readonly client: ClientProxy ) { }

  create( createOfficeDto: CreateOfficeDto ): Observable<Office> {
    return this.client.send( OFFICE_PATTERNS.CREATE, createOfficeDto );
  }

  findAll(): Observable<Office[]> {
    return this.client.send( OFFICE_PATTERNS.FIND_ALL, {} );
  }

  findOne( id: number ): Observable<Office> {
    return this.client.send( OFFICE_PATTERNS.FIND_ONE, id );
  }

  update( id: number, updateOfficeDto: UpdateOfficeDto ): Observable<UpdateResult> {
    return this.client.send( OFFICE_PATTERNS.UPDATE, { id, updateOfficeDto } );
  }

  remove( id: number ): Observable<DeleteResult> {
    return this.client.send( OFFICE_PATTERNS.REMOVE, id );
  }
}
