import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly pages: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  readonly quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly publishingStart: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly publishingEnd: Date;

  @ApiPropertyOptional( { type: [ Number ] } )
  @IsOptional()
  @IsNumber( {}, { each: true } )
  readonly categoryIds: number[];

  @ApiPropertyOptional( { type: [ Number ] } )
  @IsOptional()
  @IsNumber( {}, { each: true } )
  readonly authorIds: number[];

  @ApiPropertyOptional( { type: [ Number ] } )
  @IsOptional()
  readonly materials: { id: number; amount: number; }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly forceQuantity: boolean;
}
