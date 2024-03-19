import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SendMobileNotificationDto } from './dto/send-mobile-notification.dto';
import { MobileNotificationsService } from './mobile-notifications.service';

@Controller()
export class MobileNotificationsController {
  constructor(
    private readonly mobileNotificationsService: MobileNotificationsService,
  ) {}

  @EventPattern({ cmd: 'notify-mobile' })
  async sendNotification(data: SendMobileNotificationDto) {
    this.mobileNotificationsService.sendNotification(data);
  }
}
