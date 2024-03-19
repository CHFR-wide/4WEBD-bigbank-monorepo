import { BankAccountsTcpModule } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';

@Module({
  imports: [BankAccountsTcpModule],
  controllers: [BankAccountsController],
})
export class BankAccountsModule {}
