import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  @IsNumber()
  readonly officeId: number;

  @IsOptional()
  @IsNumber()
  readonly bookId: number;

  @IsOptional()
  @IsNumber()
  readonly userId: number;

  @IsOptional()
  @IsString()
  readonly date: Date;

  @IsOptional()
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
