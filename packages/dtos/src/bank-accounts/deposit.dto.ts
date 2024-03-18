import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class DepositDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  amount: number;
}
