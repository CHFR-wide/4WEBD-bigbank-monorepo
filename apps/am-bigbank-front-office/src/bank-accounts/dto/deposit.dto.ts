import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class WithdrawDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  amount: number;
}
