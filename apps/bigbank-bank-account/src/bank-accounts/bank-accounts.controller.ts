import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BankAccount } from '@prisma/client';
import { BankAccountsService } from './bank-accounts.service';

@Controller()
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}
  @MessagePattern({ cmd: 'bankAccount-create' })
  async create(data: { label: string; userId: number }): Promise<BankAccount> {
    return this.bankAccountsService.create(data);
  }

  @MessagePattern({ cmd: 'bankAccount-findAll' })
  async findAllForUser(data: { userId: number }) {
    return await this.bankAccountsService.findAllForUser(data);
  }

  @MessagePattern({ cmd: 'bankAccount-findOne' })
  async findOne(data: { id: number }) {
    return await this.bankAccountsService.findOne(data);
  }

  @MessagePattern({ cmd: 'bankAccount-withdraw' })
  async withdraw(data: { id: number; amount: number }) {
    const canWithdraw = await this.bankAccountsService.canWithdraw(data);

    if (!canWithdraw) {
      throw new BadRequestException('Not enough funds');
    }

    return this.bankAccountsService.withdraw(data);
  }

  @MessagePattern({ cmd: 'bankAccount-deposit' })
  async deposit(data: { id: number; userId: number; amount: number }) {
    return this.bankAccountsService.deposit(data);
  }

  @MessagePattern({ cmd: 'bankAccount-update' })
  async update(data: { id: number; label: string }) {
    return await this.bankAccountsService.update(data);
  }

  @MessagePattern({ cmd: 'bankAccount-delete' })
  async remove(data: { id: number }) {
    return await this.bankAccountsService.remove(data);
  }
}
