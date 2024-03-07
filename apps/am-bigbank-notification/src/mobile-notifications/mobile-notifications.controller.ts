import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SendMobileNotificationDto } from './dto/send-mobile-notification.dto';
import { MobileNotificationsService } from './mobile-notifications.service';

@Controller()
export class MobileNotificationsController {
  constructor(
    private readonly mobileNotificationsService: MobileNotificationsService,
  ) {}

  @MessagePattern({ cmd: 'notify-mobile' })
  async sendNotification(data: SendMobileNotificationDto): Promise<boolean> {
    this.mobileNotificationsService.sendNotification(data);

    return true;
  }
}
