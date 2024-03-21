import {
  ETransferError,
  ETransferStatus,
  NotificationsAmqpService,
  TransfersAmqpService,
} from '@ambigbank/services';
import { Injectable } from '@nestjs/common';
import { BankAccount } from 'prisma-client';
import { PrismaService } from 'src/db-access/prisma.service';

@Injectable()
export class BankAccountsService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    private transfersAmqpService: TransfersAmqpService,
    private notificationsAmqpService: NotificationsAmqpService,
  ) {}

  async create(label: string, userId: number): Promise<BankAccount> {
    return await this.prismaService.bankAccount.create({
      data: { label, userId, balance: 0 },
    });
  }

  async findAllForUser(userId: number): Promise<BankAccount[]> {
    return await this.prismaService.bankAccount.findMany({
      where: { userId },
    });
  }

  async findOne(id: number): Promise<BankAccount> {
    return await this.prismaService.bankAccount.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, label: string): Promise<BankAccount> {
    return await this.prismaService.bankAccount.update({
      data: { label },
      where: { id },
    });
  }

  async remove(id: number): Promise<BankAccount> {
    return await this.prismaService.bankAccount.delete({
      where: { id },
    });
  }

  async deposit(id: number, amount: number): Promise<BankAccount> {
    return this.prismaService.bankAccount.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  }

  async withdraw(id: number, amount: number): Promise<BankAccount> {
    return this.prismaService.bankAccount.update({
      where: { id: id },
      data: { balance: { decrement: amount } },
    });
  }

  async canWithdraw(id: number, amount: number) {
    const bankAccount = await this.findOne(id);

    return bankAccount.balance.toNumber() >= amount;
  }

  async userOwnsAccount(id: number, userId: number) {
    const bankAccount = await this.prismaService.bankAccount.findUnique({
      where: { id },
    });

    return bankAccount && bankAccount.userId === userId;
  }

  async transferMoney(
    userId: number,
    transferId: number,
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ) {
    const senderAccount = await this.findOne(fromAccountId).catch(() => null);
    const recipientAccount = await this.findOne(toAccountId).catch(() => null);

    if (!senderAccount) {
      this.transfersAmqpService.ackTransfer(
        transferId,
        ETransferStatus.ERROR,
        ETransferError.SENDER_ACCOUNT_NOT_FOUND,
      );
      return;
    }
    if (!recipientAccount) {
      this.transfersAmqpService.ackTransfer(
        transferId,
        ETransferStatus.ERROR,
        ETransferError.RECIPIENT_ACCOUNT_NOT_FOUND,
      );
      return;
    }
    if (!(await this.userOwnsAccount(fromAccountId, userId))) {
      this.transfersAmqpService.ackTransfer(
        transferId,
        ETransferStatus.ERROR,
        ETransferError.SENDER_ACCOUNT_NOT_OWNER,
      );
      return;
    }
    if (!(await this.canWithdraw(fromAccountId, amount))) {
      this.transfersAmqpService.ackTransfer(
        transferId,
        ETransferStatus.ERROR,
        ETransferError.SENDER_ACCOUNT_NOT_ENOUGH_FUNDS,
      );
      return;
    }

    try {
      await this.prismaService.$transaction([
        this.prismaService.bankAccount.update({
          where: { id: fromAccountId },
          data: { balance: { decrement: amount } },
        }),
        this.prismaService.bankAccount.update({
          where: { id: toAccountId },
          data: { balance: { increment: amount } },
        }),
      ]);
    } catch (error) {
      this.transfersAmqpService.ackTransfer(
        transferId,
        ETransferStatus.ERROR,
        ETransferError.TRANSACTION_ERROR,
      );
      return;
    }

    this.transfersAmqpService.ackTransfer(transferId, ETransferStatus.DONE);
    this.notifyTransferActors(
      senderAccount.userId,
      recipientAccount.userId,
      amount,
    );
  }

  async notifyTransferActors(
    senderId: number,
    recipientId: number,
    amount: number,
  ) {
    this.notificationsAmqpService.notifyMobile(
      senderId,
      `Your transfer of ${amount} euros has succeeded`,
    );
    this.notificationsAmqpService.notifyMobile(
      recipientId,
      `You have received a transfer of ${amount} euros`,
    );
  }
}
