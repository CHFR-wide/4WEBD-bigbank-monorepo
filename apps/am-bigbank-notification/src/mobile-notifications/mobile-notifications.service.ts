import { Injectable } from '@nestjs/common';
import { SendMobileNotificationDto } from './dto/send-mobile-notification.dto';

@Injectable()
export class MobileNotificationsService {
  async sendNotification(data: SendMobileNotificationDto) {
    console.log(
      `Sending push notification to phone ${data.phoneNumber}: ${data.content}`,
    );
  }
}
