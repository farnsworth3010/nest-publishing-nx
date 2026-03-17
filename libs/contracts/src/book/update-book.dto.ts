import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// import { MaterialDto } from 'src/modules/material/dto/material.dto';

export class UpdateBookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly pages: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly value: number;

  @ApiPropertyOptional()
  @IsNumber()
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
