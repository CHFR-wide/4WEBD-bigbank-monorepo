import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { PrismaModule } from './db-access/prisma.module';
import { PrismaExceptionWrapper } from './filters/prisma-exception-wrapper';

@Module({
  imports: [BankAccountsModule, PrismaModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionWrapper,
    },
  ],
})
export class AppModule {}
