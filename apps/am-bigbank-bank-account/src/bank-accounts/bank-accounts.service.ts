import { TransfersAmqpService } from '@ambigbank/services';
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
    transferId: number,
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ) {
    try {
      await this.canWithdraw(fromAccountId, amount);

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

      this.transfersAmqpService.setTransferDone(transferId);
    } catch (error) {
      this.transfersAmqpService.setTransferError(transferId);
    }
  }
}
