import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.getOrThrow('MS_TRANSFER_HOST'),
      port: +configService.getOrThrow('MS_TRANSFER_PORT'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get('RMQ_HOST', 'localhost')}:${configService.get('RMQ_PORT', '5672')}`,
      ],
      queue: 'transfer-queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
