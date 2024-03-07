import { Module } from '@nestjs/common';
import { MobileNotificationsModule } from './mobile-notifications/mobile-notifications.module';

@Module({
  imports: [MobileNotificationsModule],
})
export class AppModule {}
