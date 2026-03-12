import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookMaterialDto {
  @ApiProperty()
  @IsNumber()
  readonly materialId: number;

  @ApiProperty()
  @IsNumber()
  readonly bookId: number;

  @ApiProperty()
  @IsNumber()
  readonly amount: number;
}
