import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { PrismaModule } from './db-access/prisma.module';
import { PrismaExceptionWrapper } from './filters/prisma-exception-wrapper';

@Module({
  imports: [
    BankAccountsModule,
    PrismaModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionWrapper,
    },
  ],
})
export class AppModule {}
