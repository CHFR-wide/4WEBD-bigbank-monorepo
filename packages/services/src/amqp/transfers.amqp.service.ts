import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransfersAmqpService {
  /**
   *
   */
  constructor(@Inject('RMQ_MS_TRANSFER') private transferClient: ClientProxy) {}

  async setTransferDone(id: number) {
    const data = {id}

    return await firstValueFrom(
      this.transferClient.emit({ cmd: 'transfer-status-done' }, data),
    );
  }

  async setTransferError(id: number) {
    const data = {id}

    return await firstValueFrom(
      this.transferClient.emit({ cmd: 'transfer-status-error' }, data),
    );
  }
}
