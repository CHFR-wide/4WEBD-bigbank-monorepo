import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    @Inject('BANKS_SERVICE') private banksClient: ClientProxy,
  ) {}
  async create(userId: number, createBankAccountDto: CreateBankAccountDto) {
    const data = { label: createBankAccountDto.label, userId: userId };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-create' }, data),
    );
  }

  async findAllForUser(userId: number) {
    return await this.prismaService.bankAccount.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number) {
    return await this.prismaService.bankAccount.findUniqueOrThrow({
      where: { id, userId },
    });
  }

  async update(
    id: number,
    userId: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return await this.prismaService.bankAccount.update({
      data: updateBankAccountDto,
      where: { id, userId },
    });
  }

  async remove(id: number, userId: number) {
    return await this.prismaService.bankAccount.delete({
      where: { id, userId },
    });
  }

  async deposit(id: number, userId: number, amount: number) {
    return this.prismaService.bankAccount.update({
      where: { id, userId },
      data: { balance: { increment: amount } },
    });
  }

  async withdraw(id: number, userId: number, amount: number) {
    return this.prismaService.bankAccount.update({
      where: { id, userId },
      data: { balance: { decrement: amount } },
    });
  }

  async canWithdraw(id: number, userId: number, amount: number) {
    const bankAccount = await this.findOne(id, userId);

    return bankAccount.balance >= new Prisma.Decimal(amount);
  }
}
