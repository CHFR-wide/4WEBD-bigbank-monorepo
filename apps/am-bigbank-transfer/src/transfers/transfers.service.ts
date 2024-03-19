import {
  BankAccountsAmqpService,
  BankAccountsTcpService,
  NotificationsAmqpService,
} from '@ambigbank/services';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma-client';
import { PrismaService } from 'src/db-access/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    private readonly notificationsService: NotificationsAmqpService,
    private readonly bankAccountsService: BankAccountsTcpService,
    private readonly bankAccountsAmqpService: BankAccountsAmqpService,
  ) {}

  async create(transfer: TransferDto) {
    const res = await this.prismaService.transfer.create({
      data: transfer,
    });

    this.notifyTransferActors(transfer);
    this.bankAccountsAmqpService.transferMoney(
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

  async notifyTransferActors(transfer: TransferDto) {
    const senderAccount = await this.bankAccountsService.findOne(
      transfer.fromAccountId,
    );
    const recipientAccount = await this.bankAccountsService.findOne(
      transfer.toAccountId,
    );

    await Promise.all([
      this.notificationsService.notifyMobile(
        senderAccount.userId,
        `Your transfer of ${transfer.amount} euros has succeeded`,
      ),
      this.notificationsService.notifyMobile(
        recipientAccount.userId,
        `You have received a transfer of ${transfer.amount} euros`,
      ),
    ]);
  }

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccountId: userId }, { toAccountId: userId }] },
    });
  }
}
