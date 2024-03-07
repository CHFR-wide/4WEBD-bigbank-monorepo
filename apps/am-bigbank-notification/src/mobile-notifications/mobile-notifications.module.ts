import { Module } from '@nestjs/common';
import { MobileNotificationsService } from './mobile-notifications.service';
import { MobileNotificationsController } from './mobile-notifications.controller';

@Module({
  controllers: [MobileNotificationsController],
  providers: [MobileNotificationsService],
})
export class MobileNotificationsModule {}
