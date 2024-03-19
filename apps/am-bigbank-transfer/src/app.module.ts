import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './db-access/prisma.module';
import { PrismaExceptionWrapper } from './filters/prisma-exception-wrapper';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    PrismaModule,
    TransfersModule,
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
