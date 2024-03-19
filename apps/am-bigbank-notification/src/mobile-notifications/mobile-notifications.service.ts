import { UsersTcpService } from '@ambigbank/services';
import { Injectable } from '@nestjs/common';
import { SendMobileNotificationDto } from './dto/send-mobile-notification.dto';

@Injectable()
export class MobileNotificationsService {
  /**
   *
   */
  constructor(private usersService: UsersTcpService) {}

  async sendNotification(data: SendMobileNotificationDto) {
    const user = await this.usersService.findOne(data.userId);

    console.log(
      `Sending push notification to phone ${user.phoneNumber}: ${data.content}`,
    );
  }
}
