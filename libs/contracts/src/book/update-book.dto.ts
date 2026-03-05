import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// import { MaterialDto } from 'src/modules/material/dto/material.dto';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly pages: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly value: number;

  @IsNumber()
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

  // @IsOptional()
  // @ValidateNested({ each: true })
  // readonly materials: MaterialDto[];

  @IsOptional()
  @IsBoolean()
  readonly forceQuantity: boolean;
}
