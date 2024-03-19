import {
  NotificationsAmqpModule,
  TransfersAmqpModule,
} from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';

@Module({
  imports: [TransfersAmqpModule, NotificationsAmqpModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
