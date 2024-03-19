
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransfersTcpService } from './transfers.tcp.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TCP_MS_TRANSFER',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('MS_TRANSFER_HOST'),
            port: +configService.getOrThrow('MS_TRANSFER_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TransfersTcpService],
  exports: [TransfersTcpService],
})
export class TransfersTcpModule {}
