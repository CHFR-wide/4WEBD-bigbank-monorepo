import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountsModule } from 'src/bank-accounts/bank-accounts.module';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [
    BankAccountsModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3200,
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService, PrismaService],
})
export class TransfersModule {}
