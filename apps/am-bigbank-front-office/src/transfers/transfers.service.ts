import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BankAccountsService } from 'src/bank-accounts/bank-accounts.service';
import { PrismaService } from 'src/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    private bankAccountsService: BankAccountsService,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccount: { userId } }, { toAccount: { userId } }] },
    });
  }

  async canWithdraw(transferDto: TransferDto, userId: number) {
    return await this.bankAccountsService.canWithdraw(
      transferDto.fromAccountId,
      userId,
      transferDto.amount,
    );
  }

  async transferMoney(transferDto: TransferDto, userId: number) {
    await Promise.all([
      this.bankAccountsService.findOne(transferDto.fromAccountId, userId),
      this.bankAccountsService.findOne(transferDto.toAccountId, userId),
    ]);

    const [transfer] = await this.prismaService.$transaction([
      this.prismaService.transfer.create({
        data: transferDto,
      }),
      this.prismaService.bankAccount.update({
        where: { id: transferDto.fromAccountId },
        data: { balance: { decrement: transferDto.amount } },
      }),
      this.prismaService.bankAccount.update({
        where: { id: transferDto.toAccountId },
        data: { balance: { increment: transferDto.amount } },
      }),
    ]);

    this.notifyTransactionPartners(transferDto).catch((e) => {
      console.log('Notification service error: ', e);
    });

    return transfer;
  }

  async notifyTransactionPartners(transferDto: TransferDto) {
    {
      const [sender, recipient] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { bankAccounts: { some: { id: transferDto.fromAccountId } } },
        }),
        this.prismaService.user.findFirst({
          where: { bankAccounts: { some: { id: transferDto.toAccountId } } },
        }),
      ]);

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
