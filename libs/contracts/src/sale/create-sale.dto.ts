import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSaleDto {
  @IsOptional()
  @IsNumber()
  readonly officeId: number;

  @IsNumber()
  readonly bookId: number;

  @IsOptional()
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly date: Date;

  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  readonly price: number;

  @IsBoolean()
  readonly isExternal: boolean;
}
