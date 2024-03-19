import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationsService {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private notificationsClient: ClientProxy) {}

  async notifyMobile(userId: number, content: string) {
    return await firstValueFrom(
      this.notificationsClient.send<boolean>(
        { cmd: 'notify-mobile' },
        { userId, content},
      ),
    )
  }

}
