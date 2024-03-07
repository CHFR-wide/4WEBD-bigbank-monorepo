import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { TransferDto } from './dto/transfer.dto';
import { TransfersService } from './transfers.service';

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
    const canWithdraw = await this.transfersService.canWithdraw(
      transferDto,
      user.sub,
    );
    if (!canWithdraw) {
      throw new BadRequestException('You do not have enough funds');
    }

    return await this.transfersService.transferMoney(transferDto, user.sub);
  }
}
