import { BankAccountsService } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TEnvironmentValues } from 'src/environment';
import { BankAccountsController } from './bank-accounts.controller';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'BANKS_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const env = configService.get<TEnvironmentValues>('env');

            return {
              transport: Transport.TCP,
              options: {
                host: env.msBankAccount.host,
                port: +env.msBankAccount.port,
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
