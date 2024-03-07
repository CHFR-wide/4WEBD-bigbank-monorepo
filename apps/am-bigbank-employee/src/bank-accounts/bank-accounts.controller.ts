import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiBearerAuth()
@Controller('bank-account')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsService) {}

  @Post()
  async create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return await this.bankAccountService.create(
      createBankAccountDto.userId,
      createBankAccountDto,
    );
  }

  @Get('for-user/:id')
  async findAllForUser(@Param('id') userId: string) {
    return await this.bankAccountService.findAllForUser(+userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bankAccountService.findOne(+id);
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Body() widthdrawDto: WithdrawDto) {
    const canWithdraw = await this.bankAccountService.canWithdraw(
      +id,
      widthdrawDto.amount,
    );

    if (!canWithdraw) {
      throw new BadRequestException('Not enough funds');
    }

    return this.bankAccountService.withdraw(+id, widthdrawDto.amount);
  }

  @Post(':id/deposit')
  async deposit(@Param('id') id: string, @Body() widthdrawDto: WithdrawDto) {
    return this.bankAccountService.deposit(+id, widthdrawDto.amount);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return await this.bankAccountService.update(+id, updateBankAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bankAccountService.remove(+id);
  }
}
