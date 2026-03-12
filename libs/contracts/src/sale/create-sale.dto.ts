import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly officeId: number;

  @ApiProperty()
  @IsNumber()
  readonly bookId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @IsString()
  readonly date: Date;

  @ApiProperty()
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
