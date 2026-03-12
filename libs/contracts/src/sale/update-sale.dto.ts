import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSaleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly officeId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly bookId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @IsBoolean()
  readonly isExternal: boolean;
}
