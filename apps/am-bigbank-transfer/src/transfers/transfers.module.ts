import {
  BankAccountsAmqpModule,
  BankAccountsTcpModule,
  NotificationsAmqpModule,
} from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [
    BankAccountsTcpModule,
    BankAccountsAmqpModule,
    NotificationsAmqpModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
