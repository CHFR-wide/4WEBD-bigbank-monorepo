import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma.service';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BANKS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3300,
        },
      },
    ]),
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, PrismaService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
