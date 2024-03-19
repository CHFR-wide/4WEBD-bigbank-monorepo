import { UsersTcpModule } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { MobileNotificationsController } from './mobile-notifications.controller';
import { MobileNotificationsService } from './mobile-notifications.service';

@Module({
  imports: [UsersTcpModule],
  controllers: [MobileNotificationsController],
  providers: [MobileNotificationsService],
})
export class MobileNotificationsModule {}
