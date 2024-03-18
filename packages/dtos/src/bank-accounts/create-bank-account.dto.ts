import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  label: string;
}
