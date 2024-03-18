import { TransfersService } from '@ambigbank/services';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { TransferDto } from './dto/transfer.dto';

@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  async findAllForUser(@UserJwt() user: TUserJwt) {
    return await this.transfersService.findAllForUser(user.sub);
  }

  @Post()
  async transferMoney(
    @UserJwt() user: TUserJwt,
    @Body() transferDto: TransferDto,
  ) {
    await this.checkSenderOwnership(transferDto, user.sub);
    await this.checkSenderFunds(transferDto);

    return await this.transfersService.transferMoney(transferDto);
  }

  async checkSenderOwnership(transfer: TransferDto, userId: number) {
    const senderOwnsAccount = await this.transfersService.senderOwnsAccount(
      transfer,
      userId,
    );

    if (!senderOwnsAccount) throw new ForbiddenException();
  }

  async checkSenderFunds(transfer: TransferDto) {
    const canWithdraw = await this.transfersService.canWithdraw(transfer);
    if (!canWithdraw) {
      throw new BadRequestException('You do not have enough funds');
    }
  }
}
