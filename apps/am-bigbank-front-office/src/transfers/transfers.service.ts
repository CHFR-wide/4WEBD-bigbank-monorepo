import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BankAccountsService } from 'src/bank-accounts/bank-accounts.service';
import { UsersService } from 'src/users/users.service';
import { TransferDto } from './dto/transfer.dto';

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

  async canWithdraw(transferDto: TransferDto) {
    return await this.bankAccountsService.canWithdraw(
      transferDto.fromAccountId,
      transferDto.amount,
    );
  }

  async transferMoney(transferDto: TransferDto) {
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

    this.notifyTransactionPartners(transferDto).catch((e) => {
      console.log('Notification service error: ', e);
    });

    return transfer;
  }

  async notifyTransactionPartners(transferDto: TransferDto) {
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
}
