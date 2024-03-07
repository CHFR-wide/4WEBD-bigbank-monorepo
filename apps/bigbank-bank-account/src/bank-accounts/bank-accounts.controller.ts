import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BankAccount } from '@repo/database';
import { BankAccountsService } from './bank-accounts.service';

@Controller()
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}
  @MessagePattern({ cmd: 'bankAccount-create' })
  async create(data: { label: string; userId: number }): Promise<BankAccount> {
    return this.bankAccountsService.create(data);
  }

  @MessagePattern({ cmd: 'bankAccount-findAll' })
  async findAllForUser(data: { userId: number }): Promise<BankAccount[]> {
    return await this.bankAccountsService.findAllForUser(data);
  }

  @MessagePattern({ cmd: 'bankAccount-findOne' })
  async findOne(data: { id: number }): Promise<BankAccount> {
    return await this.bankAccountsService.findOne(data);
  }

  @MessagePattern({ cmd: 'bankAccount-withdraw' })
  async withdraw(data: { id: number; amount: number }): Promise<BankAccount> {
    const canWithdraw = await this.bankAccountsService.canWithdraw(data);

    if (!canWithdraw) {
      throw new BadRequestException('Not enough funds');
    }

    return this.bankAccountsService.withdraw(data);
  }

  @MessagePattern({ cmd: 'bankAccount-deposit' })
  async deposit(data: { id: number; amount: number }): Promise<BankAccount> {
    return this.bankAccountsService.deposit(data);
  }

  @MessagePattern({ cmd: 'bankAccount-update' })
  async update(data: { id: number; label: string }): Promise<BankAccount> {
    return await this.bankAccountsService.update(data);
  }

  @MessagePattern({ cmd: 'bankAccount-delete' })
  async remove(data: { id: number }): Promise<BankAccount> {
    return await this.bankAccountsService.remove(data);
  }
}
