import { Injectable } from '@nestjs/common';
import { BankAccount, Prisma } from 'prisma-client';
import { PrismaService } from 'src/db-access/prisma.service';

@Injectable()
export class BankAccountsService {
  /**
   *
   */
  constructor(private prismaService: PrismaService) {}

  async create(data: { label: string; userId: number }): Promise<BankAccount> {
    return await this.prismaService.bankAccount.create({
      data: { ...data, balance: 0 },
    });
  }

  async findAllForUser(data: { userId: number }): Promise<BankAccount[]> {
    return await this.prismaService.bankAccount.findMany({
      where: data,
    });
  }

  async findOne(data: { id: number }): Promise<BankAccount> {
    return await this.prismaService.bankAccount.findUniqueOrThrow({
      where: data,
    });
  }

  async update(data: { id: number; label: string }): Promise<BankAccount> {
    return await this.prismaService.bankAccount.update({
      data: { label: data.label },
      where: { id: data.id },
    });
  }

  async remove(data: { id: number }): Promise<BankAccount> {
    return await this.prismaService.bankAccount.delete({
      where: { id: data.id },
    });
  }

  async deposit(data: { id: number; amount: number }): Promise<BankAccount> {
    return this.prismaService.bankAccount.update({
      where: { id: data.id },
      data: { balance: { increment: data.amount } },
    });
  }

  async withdraw(data: { id: number; amount: number }): Promise<BankAccount> {
    return this.prismaService.bankAccount.update({
      where: { id: data.id },
      data: { balance: { decrement: data.amount } },
    });
  }

  async canWithdraw(data: { id: number; amount: number }) {
    const bankAccount = await this.findOne(data);

    return bankAccount.balance >= new Prisma.Decimal(data.amount);
  }

  async userOwnsAccount(data: { id: number; userId: number }) {
    const bankAccount = await this.prismaService.bankAccount.findUnique({
      where: { id: data.id },
    });

    return bankAccount.userId === data.userId;
  }
}
