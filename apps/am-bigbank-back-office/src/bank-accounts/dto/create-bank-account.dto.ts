import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsInt()
  userId: number;
}
