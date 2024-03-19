import { TransfersAmqpService } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RMQ_MS_TRANSFER',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RMQ_HOST')}:${configService.get('RMQ_PORT')}`,
            ],
            queue: 'transfer-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, TransfersAmqpService],
})
export class BankAccountsModule {}
