import { BankAccountsAmqpService, ETransferStatus } from '@ambigbank/services';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma-client';
import { PrismaService } from 'src/db-access/prisma.service';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    private readonly bankAccountsAmqpService: BankAccountsAmqpService,
  ) {}

  async create(
    userId: number,
    transfer: { fromAccountId: number; toAccountId: number; amount: number },
  ) {
    const res = await this.prismaService.transfer.create({
      data: { ...transfer, status: ETransferStatus.PROCESSING },
    });

    this.bankAccountsAmqpService.transferMoney(
      userId,
      res.id,
      transfer.fromAccountId,
      transfer.toAccountId,
      transfer.amount,
    );

    return res;
  }

  async update(id: number, update: Prisma.TransferUpdateInput) {
    return await this.prismaService.transfer.update({
      where: { id },
      data: update,
    });
  }

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccountId: userId }, { toAccountId: userId }] },
    });
  }
}
