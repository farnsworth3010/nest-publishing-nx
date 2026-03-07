import { CreateMaterialDto } from '@app/contracts/material/create-material.dto';
import { Material } from '@app/contracts/material/material.entity';
import { MATERIAL_PATTERNS } from '@app/contracts/material/material.pattern';
import { UpdateMaterialDto } from '@app/contracts/material/update-material.dto';
import { MATERIAL_CLIENT } from '@app/gateway/constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class MaterialService {
  constructor( @Inject( MATERIAL_CLIENT ) private readonly client: ClientProxy ) { }

  create( createMaterialDto: CreateMaterialDto ): Observable<Material> {
    // TODO: use patterns with Inject
    return this.client.send( MATERIAL_PATTERNS.CREATE, createMaterialDto );
  }

  findAll(): Observable<Material[]> {
    return this.client.send( MATERIAL_PATTERNS.FIND_ALL, {} );
  }

  findOne( id: number ): Observable<Material> {
    return this.client.send( MATERIAL_PATTERNS.FIND_ONE, id );
  }

  update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
  ): Observable<UpdateResult> {
    return this.client.send( MATERIAL_PATTERNS.UPDATE, { id, updateMaterialDto } );
  }

  remove( id: number ): Observable<DeleteResult> {
    return this.client.send( MATERIAL_PATTERNS.REMOVE, id );
  }
}
