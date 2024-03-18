import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BankAccount } from 'prisma-client';
import { BankAccountsService } from './bank-accounts.service';

@Controller()
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}
  @MessagePattern({ cmd: 'bankAccount-create' })
  async create(data: { label: string; userId: number }): Promise<BankAccount> {
    return this.bankAccountsService.create(data.label, data.userId);
  }

  @MessagePattern({ cmd: 'bankAccount-findAll' })
  async findAllForUser(data: { userId: number }): Promise<BankAccount[]> {
    return await this.bankAccountsService.findAllForUser(data.userId);
  }

  @MessagePattern({ cmd: 'bankAccount-findOne' })
  async findOne(data: { id: number }): Promise<BankAccount> {
    return await this.bankAccountsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'bankAccount-canWithdraw' })
  async canWithdraw(data: { id: number; amount: number }): Promise<boolean> {
    return await this.bankAccountsService.canWithdraw(data.id, data.amount);
  }

  @MessagePattern({ cmd: 'bankAccount-withdraw' })
  async withdraw(data: { id: number; amount: number }): Promise<BankAccount> {
    return this.bankAccountsService.withdraw(data.id, data.amount);
  }

  @MessagePattern({ cmd: 'bankAccount-deposit' })
  async deposit(data: { id: number; amount: number }): Promise<BankAccount> {
    return this.bankAccountsService.deposit(data.id, data.amount);
  }

  @MessagePattern({ cmd: 'bankAccount-update' })
  async update(data: { id: number; label: string }): Promise<BankAccount> {
    return await this.bankAccountsService.update(data.id, data.label);
  }

  @MessagePattern({ cmd: 'bankAccount-delete' })
  async remove(data: { id: number }): Promise<BankAccount> {
    return await this.bankAccountsService.remove(data.id);
  }

  @MessagePattern({ cmd: 'bankAccount-userOwnsAccount' })
  async userOwnsAccount(data: {
    id: number;
    userId: number;
  }): Promise<boolean> {
    return await this.bankAccountsService.userOwnsAccount(data.id, data.userId);
  }
}
