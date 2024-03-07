import { Module } from '@nestjs/common';
import { BankAccountsModule } from 'src/bank-accounts/bank-accounts.module';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [BankAccountsModule, UsersModule],
  controllers: [TransfersController],
  providers: [TransfersService, PrismaService],
})
export class TransfersModule {}
