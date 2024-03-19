
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsAmqpService } from './notifications.amqp.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RMQ_MS_NOTIFICATION',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RMQ_HOST')}:${configService.get('RMQ_PORT')}`,
            ],
            queue: 'notification-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NotificationsAmqpService],
  exports: [NotificationsAmqpService],
})
export class NotificationsAmqpModule {}
