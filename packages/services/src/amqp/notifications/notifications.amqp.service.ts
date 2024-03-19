import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationsAmqpService {
  constructor(@Inject('RMQ_MS_NOTIFICATION') private notificationsClient: ClientProxy) {}

  async notifyMobile(userId: number, content: string) {
    return await firstValueFrom(
      this.notificationsClient.emit(
        { cmd: 'notify-mobile' },
        { userId, content},
      ),
    )
  }
}
