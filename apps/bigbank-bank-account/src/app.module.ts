import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { PrismaModule } from './db-access/prisma.module';

@Module({
  imports: [BankAccountsModule, PrismaModule],
})
export class AppModule {}
