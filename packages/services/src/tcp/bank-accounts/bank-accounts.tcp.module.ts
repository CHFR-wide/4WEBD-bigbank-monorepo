
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountsTcpService } from './bank-accounts.tcp.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TCP_MS_BANK_ACCOUNT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('MS_BANK_ACCOUNT_HOST'),
            port: +configService.getOrThrow('MS_BANK_ACCOUNT_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [BankAccountsTcpService],
  exports: [BankAccountsTcpService],
})
export class BankAccountsTcpModule {}
