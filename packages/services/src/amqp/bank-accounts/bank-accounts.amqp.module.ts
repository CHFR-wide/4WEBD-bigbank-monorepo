
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountsAmqpService } from './bank-accounts.amqp.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RMQ_MS_BANK_ACCOUNT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RMQ_HOST')}:${configService.get('RMQ_PORT')}`,
            ],
            queue: 'bank-account-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [BankAccountsAmqpService],
  exports: [BankAccountsAmqpService],
})
export class BankAccountsAmqpModule {}
