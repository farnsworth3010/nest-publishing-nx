import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class MaterialDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number;
}