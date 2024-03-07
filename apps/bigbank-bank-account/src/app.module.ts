import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';

@Module({
  imports: [BankAccountsModule],
})
export class AppModule {}
