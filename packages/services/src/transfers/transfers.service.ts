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
    private bankAccountsService: BankAccountsService,
    private usersService: UsersService,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
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
    await Promise.all([
      this.bankAccountsService.findOne(transferDto.fromAccountId),
      this.bankAccountsService.findOne(transferDto.toAccountId),
    ]);

    const transfer = await firstValueFrom(
      this.transferClient.send(
        { cmd: 'transfer-create' },
        { transfer: transferDto },
      ),
    );

    await Promise.all([
      this.bankAccountsService.withdraw(
        transferDto.fromAccountId,
        transferDto.amount,
      ),
      this.bankAccountsService.deposit(
        transferDto.toAccountId,
        transferDto.amount,
      ),
    ]);

    this.notifyTransactionPartners(transferDto).catch((e) => {
      console.log('Notification service error: ', e);
    });

    return transfer;
  }

  async notifyTransactionPartners(transferDto: TTransfer) {
    {
      const { userId: senderId } = await this.bankAccountsService.findOne(
        transferDto.fromAccountId,
      );
      const { userId: recipientId } = await this.bankAccountsService.findOne(
        transferDto.toAccountId,
      );

      const sender = await this.usersService.findOne(senderId);
      const recipient = await this.usersService.findOne(recipientId);

      await Promise.all([
        firstValueFrom(
          this.notificationClient.send<boolean>(
            { cmd: 'notify-mobile' },
            {
              phoneNumber: sender.phoneNumber,
              content: `Your transfer of ${transferDto.amount} has succeeded`,
            },
          ),
        ),
        firstValueFrom(
          this.notificationClient.send<boolean>(
            { cmd: 'notify-mobile' },
            {
              phoneNumber: recipient.phoneNumber,
              content: `You have received a transfer of ${transferDto.amount}`,
            },
          ),
        ),
      ]);
    }
  }

  async senderOwnsAccount(transfer: TTransfer, userId: number) {
    return await this.bankAccountsService.userOwnsAccount(
      transfer.fromAccountId,
      userId,
    );
  }
}
