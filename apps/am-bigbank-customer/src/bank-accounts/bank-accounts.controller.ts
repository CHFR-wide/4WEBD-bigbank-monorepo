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
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiBearerAuth()
@Controller('bank-account')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsService) {}

  @Post()
  async create(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @UserJwt() user: TUserJwt,
  ) {
    return await this.bankAccountService.create(user.sub, createBankAccountDto);
  }

  @Get()
  async findAllForUser(@UserJwt() user: TUserJwt) {
    return await this.bankAccountService.findAllForUser(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @UserJwt() user: TUserJwt) {
    return await this.bankAccountService.findOne(+id, user.sub);
  }

  @Post(':id/withdraw')
  async withdraw(
    @Param('id') id: string,
    @Body() widthdrawDto: WithdrawDto,
    @UserJwt() user: TUserJwt,
  ) {
    const canWithdraw = await this.bankAccountService.canWithdraw(
      +id,
      user.sub,
      widthdrawDto.amount,
    );

    if (!canWithdraw) {
      throw new BadRequestException('Not enough funds');
    }

    return this.bankAccountService.withdraw(+id, user.sub, widthdrawDto.amount);
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: string,
    @Body() depositDto: WithdrawDto,
    @UserJwt() user: TUserJwt,
  ) {
    return this.bankAccountService.deposit(+id, user.sub, depositDto.amount);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @UserJwt() user: TUserJwt,
  ) {
    return await this.bankAccountService.update(
      +id,
      user.sub,
      updateBankAccountDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserJwt() user: TUserJwt) {
    return await this.bankAccountService.remove(+id, user.sub);
  }
}
