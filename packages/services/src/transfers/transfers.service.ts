import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
import { UsersService } from '../users/users.service';

type TTransfer = {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    @Inject(BankAccountsService) private bankAccountsService: BankAccountsService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject('TRANSFER_SERVICE') private transferClient: ClientProxy,
  ) {}

  async findAllForUser(userId: number) {
    return await firstValueFrom(
      this.transferClient.send({ cmd: 'transfer-findAllForUser' }, { userId }),
    );
  }

  async canWithdraw(transferDto: TTransfer) {
    return await this.bankAccountsService.canWithdraw(
      transferDto.fromAccountId,
      transferDto.amount,
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

  async senderOwnsAccount(transfer: TTransfer, userId: number) {
    return await this.bankAccountsService.userOwnsAccount(
      transfer.fromAccountId,
      userId,
    );
  }
}
