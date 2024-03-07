import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class TransferDto {
  @ApiProperty()
  @IsInt()
  fromAccountId: number;

  @ApiProperty()
  @IsInt()
  toAccountId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
