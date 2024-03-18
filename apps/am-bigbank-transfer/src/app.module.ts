import { Module } from '@nestjs/common';
import { PrismaModule } from './db-access/prisma.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [PrismaModule, TransfersModule],
})
export class AppModule {}
