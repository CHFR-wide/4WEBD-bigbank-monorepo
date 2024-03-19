import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type TBankAccount = {label: string}

@Injectable()
export class BankAccountsService {
  /**
   *
   */
  constructor(@Inject('BANKS_SERVICE') private banksClient: ClientProxy) {}

  async create(userId: number, bankAccount: TBankAccount) {
    const data = {userId, label: bankAccount.label}

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-create' }, data),
    );
  }

  async findAllForUser(userId: number) {
    const data = { userId: userId };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-findAll' }, data),
    );
  }

  async findOne(id: number) {
    const data = { id };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-findOne' }, data),
    );
  }

  async update(id: number, bankAccount: Partial<TBankAccount>) {
    const data = { id, label: bankAccount.label };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-update' }, data),
    );
  }

  async remove(id: number) {
    const data = { id };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-delete' }, data),
    );
  }

  async deposit(id: number, amount: number) {
    const data = { id, amount };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-deposit' }, data),
    );
  }

  async withdraw(id: number, amount: number) {
    const data = { id, amount };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-withdraw' }, data),
    );
  }

  async canWithdraw(id: number, amount: number) {
    const data = { id, amount };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-canWithdraw' }, data),
    );
  }

  async userOwnsAccount(id: number, userId: number) {
    const data = { id, userId };

    return await firstValueFrom(
      this.banksClient.send({ cmd: 'bankAccount-userOwnsAccount' }, data),
    );
  }
}
