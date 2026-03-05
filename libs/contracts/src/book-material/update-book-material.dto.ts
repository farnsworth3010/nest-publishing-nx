import { IsNumber } from 'class-validator';

export class UpdateBookMaterialDto {
  @IsNumber()
  readonly materialId: number;

  @IsNumber()
  readonly bookId: number;

  @IsNumber()
  readonly amount: number;
}
