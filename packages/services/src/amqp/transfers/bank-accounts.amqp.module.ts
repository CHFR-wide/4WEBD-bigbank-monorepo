
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransfersAmqpService } from './transfers.amqp.service';

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
  providers: [TransfersAmqpService],
  exports: [TransfersAmqpService],
})
export class TransfersAmqpModule {}
