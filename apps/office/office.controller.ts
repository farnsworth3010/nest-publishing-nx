import { CreateOfficeDto } from '@app/contracts/office/create-office.dto';
import { Office } from '@app/contracts/office/office.entity';
import { OFFICE_PATTERNS } from '@app/contracts/office/office.pattern';
import { UpdateOfficeDto } from '@app/contracts/office/update-office.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { OfficeService } from './office.service';

@Controller()
export class OfficeController {
  constructor( private readonly officeService: OfficeService ) { }

  @MessagePattern( OFFICE_PATTERNS.CREATE )
  create( @Payload() createOfficeDto: CreateOfficeDto ): Promise<Office> {
    return this.officeService.create( createOfficeDto );
  }

  @MessagePattern( OFFICE_PATTERNS.FIND_ALL )
  findAll(): Promise<Office[]> {
    return this.officeService.findAll();
  }

  @MessagePattern( OFFICE_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<Office> {
    return this.officeService.findOne( id );
  }

  @MessagePattern( OFFICE_PATTERNS.UPDATE )
  update( @Payload() { id, updateOfficeDto }: { id: number; updateOfficeDto: UpdateOfficeDto; } ): Promise<any> {
    return this.officeService.update( id, updateOfficeDto );
  }

  @MessagePattern( OFFICE_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.officeService.remove( id );
  }
}
