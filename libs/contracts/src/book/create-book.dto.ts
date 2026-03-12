import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialDto } from '@app/contracts/material/material.dto';

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

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly categoryIds: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly authorIds: number[];

  @ApiPropertyOptional({ type: [MaterialDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  readonly materials: MaterialDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly forceQuantity: boolean;
}
