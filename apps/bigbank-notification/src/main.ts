import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const msOptions = {
  host: process.env.MS_NOTIFICATION_HOST,
  port: +process.env.MS_NOTIFICATION_PORT,
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: msOptions,
    },
  );
  await app.listen();
}
bootstrap();
