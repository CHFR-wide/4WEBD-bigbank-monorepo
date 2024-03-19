import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MobileNotificationsModule } from './mobile-notifications/mobile-notifications.module';

@Module({
  imports: [
    MobileNotificationsModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
