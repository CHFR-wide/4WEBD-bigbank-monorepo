import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type TTransfer = {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

@Injectable()
export class TransfersTcpService {
  /**
   *
   */
  constructor(
    @Inject('TCP_MS_TRANSFER') private transferClient: ClientProxy,
  ) {}

  async findAllForUser(userId: number) {
    return await firstValueFrom(
      this.transferClient.send({ cmd: 'transfer-findAllForUser' }, { userId }),
    );
  }

  async transferMoney(transferDto: TTransfer) {
    return await firstValueFrom(
      this.transferClient.send(
        { cmd: 'transfer-create' },
        { transfer: transferDto },
      ),
    );
  }

  async validateTransfer(id: number) {
    return await firstValueFrom(
      this.transferClient.send(
        { cmd: 'transfer-status-done' },
        { id },
      ),
    );
  }

  async errorTransfer(id: number) {
    return await firstValueFrom(
      this.transferClient.send(
        { cmd: 'transfer-status-error' },
        { id },
      ),
    );
  }
}
