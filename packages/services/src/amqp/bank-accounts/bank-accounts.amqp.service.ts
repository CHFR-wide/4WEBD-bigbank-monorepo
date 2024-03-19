import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BankAccountsAmqpService {
  /**
   *
   */
  constructor(@Inject('RMQ_MS_BANK_ACCOUNT') private banksClient: ClientProxy) {}

  async transferMoney(userId: number, transferId: number, fromAccountId: number, toAccountId: number, amount: number) {
    const data = {userId, transferId, fromAccountId, toAccountId, amount}

    return await firstValueFrom(
      this.banksClient.emit({ cmd: 'bankAccount-transferMoney' }, data),
    );
  }
}
