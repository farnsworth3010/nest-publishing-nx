import { BookMaterial } from '@app/contracts/book-material/book-material.entity';
import { BOOK_MATERIAL_PATTERNS } from '@app/contracts/book-material/book-material.pattern';
import { CreateBookMaterialDto } from '@app/contracts/book-material/create-book-material.dto';
import { UpdateBookMaterialDto } from '@app/contracts/book-material/update-book-material.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BookMaterialService } from './book-material.service';

@Controller()
export class BookMaterialController {
  constructor( private readonly bookMaterialService: BookMaterialService ) { }

  @MessagePattern( BOOK_MATERIAL_PATTERNS.CREATE )
  create( @Payload() createBookMaterialDto: CreateBookMaterialDto ): Promise<BookMaterial> {
    return this.bookMaterialService.create( createBookMaterialDto );
  }

  @MessagePattern( BOOK_MATERIAL_PATTERNS.FIND_ALL )
  findAll(): Promise<BookMaterial[]> {
    return this.bookMaterialService.findAll();
  }

  @MessagePattern( BOOK_MATERIAL_PATTERNS.FIND_ONE )
  findOne( @Payload() id: number ): Promise<BookMaterial> {
    return this.bookMaterialService.findOne( id );
  }

  @MessagePattern( BOOK_MATERIAL_PATTERNS.UPDATE )
  update( @Payload() { id, updateBookMaterialDto }: { id: number; updateBookMaterialDto: UpdateBookMaterialDto; } ): Promise<UpdateResult> {
    return this.bookMaterialService.update( id, updateBookMaterialDto );
  }

  @MessagePattern( BOOK_MATERIAL_PATTERNS.REMOVE )
  remove( @Payload() id: number ): Promise<DeleteResult> {
    return this.bookMaterialService.remove( id );
  }
}
