import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './db-access/prisma.module';
import { PrismaExceptionWrapper } from './filters/prisma-exception-wrapper';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionWrapper,
    },
  ],
})
export class AppModule {}
