import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BankAccountsService {
  /**
   *
   */
  constructor(private prismaService: PrismaService) {}

  async create(data: { label: string; userId: number }) {
    return await this.prismaService.bankAccount.create({
      data: { ...data, balance: 0 },
    });
  }

  async findAllForUser(data: { userId: number }) {
    return await this.prismaService.bankAccount.findMany({
      where: data,
    });
  }

  async findOne(data: { id: number }) {
    return await this.prismaService.bankAccount.findUniqueOrThrow({
      where: data,
    });
  }

  async update(data: { id: number; label: string }) {
    return await this.prismaService.bankAccount.update({
      data: { label: data.label },
      where: { id: data.id },
    });
  }

  async remove(data: { id: number }) {
    return await this.prismaService.bankAccount.delete({
      where: { id: data.id },
    });
  }

  async deposit(data: { id: number; amount: number }) {
    return this.prismaService.bankAccount.update({
      where: { id: data.id },
      data: { balance: { increment: data.amount } },
    });
  }

  async withdraw(data: { id: number; amount: number }) {
    return this.prismaService.bankAccount.update({
      where: { id: data.id },
      data: { balance: { decrement: data.amount } },
    });
  }

  async canWithdraw(data: { id: number; amount: number }) {
    const bankAccount = await this.findOne(data);

    return bankAccount.balance >= new Prisma.Decimal(data.amount);
  }
}
