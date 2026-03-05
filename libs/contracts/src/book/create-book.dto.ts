import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MaterialDto } from '@app/contracts/material/material.dto';

export class CreateBookDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly pages: number;

  @IsNumber()
  @IsPositive()
  readonly value: number;

  @IsOptional()
  @IsPositive()
  readonly quantity: number;

  @IsOptional()
  @IsString()
  readonly publishingStart: Date;

  @IsOptional()
  @IsString()
  readonly publishingEnd: Date;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly categoryIds: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly authorIds: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  readonly materials: MaterialDto[];

  @IsOptional()
  @IsBoolean()
  readonly forceQuantity: boolean;
}
