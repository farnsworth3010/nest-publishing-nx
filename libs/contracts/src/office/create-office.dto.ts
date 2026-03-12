import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfficeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
