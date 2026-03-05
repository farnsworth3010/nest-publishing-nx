import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOfficeDto {
  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
