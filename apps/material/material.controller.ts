import { CreateMaterialDto } from '@app/contracts/material/create-material.dto';
import { Material } from '@app/contracts/material/material.entity';
import { MATERIAL_PATTERNS } from '@app/contracts/material/material.pattern';
import { UpdateMaterialDto } from '@app/contracts/material/update-material.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { MaterialService } from './material.service';

@Controller()
export class MaterialController {
  constructor( private readonly materialService: MaterialService ) { }

  @MessagePattern( MATERIAL_PATTERNS.CREATE )
  create( @Payload() createMaterialDto: CreateMaterialDto ): Promise<Material> {
    return this.materialService.create( createMaterialDto );
  }

  @MessagePattern( MATERIAL_PATTERNS.FIND_ALL )
  findAll(): Promise<Material[]> {
    return this.materialService.findAll();
  }

  @MessagePattern( MATERIAL_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Material> {
    return this.materialService.findOne( id );
  }

  @MessagePattern( MATERIAL_PATTERNS.UPDATE )
  update( @Payload() { id, updateMaterialDto }: { id: number; updateMaterialDto: UpdateMaterialDto; } ): Promise<any> {
    return this.materialService.update( id, updateMaterialDto );
  }

  @MessagePattern( MATERIAL_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.materialService.remove( id );
  }
}
