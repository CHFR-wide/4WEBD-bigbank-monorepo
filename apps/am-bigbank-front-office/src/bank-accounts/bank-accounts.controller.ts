import { BankAccountsTcpService } from '@ambigbank/services';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiBearerAuth()
@Controller('bank-account')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsTcpService) {}

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
    await this.checkOwnership(+id, user.sub);

    return await this.bankAccountService.findOne(+id);
  }

  @Post(':id/withdraw')
  async withdraw(
    @Param('id') id: string,
    @Body() widthdrawDto: WithdrawDto,
    @UserJwt() user: TUserJwt,
  ) {
    await this.checkOwnership(+id, user.sub);

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
  async deposit(
    @Param('id') id: string,
    @Body() depositDto: WithdrawDto,
    @UserJwt() user: TUserJwt,
  ) {
    await this.checkOwnership(+id, user.sub);

    return this.bankAccountService.deposit(+id, depositDto.amount);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @UserJwt() user: TUserJwt,
  ) {
    await this.checkOwnership(+id, user.sub);

    return await this.bankAccountService.update(+id, updateBankAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserJwt() user: TUserJwt) {
    await this.checkOwnership(+id, user.sub);

    return await this.bankAccountService.remove(+id);
  }

  private async checkOwnership(id: number, userId: number) {
    const userOwnsAccount = await this.bankAccountService.userOwnsAccount(
      id,
      userId,
    );
    if (!userOwnsAccount) throw new ForbiddenException();
  }
}
