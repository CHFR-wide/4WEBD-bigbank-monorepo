import { TransfersTcpService } from '@ambigbank/services';
import {
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { TransferDto } from './dto/transfer.dto';

@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersTcpService) {}

  @Get()
  async findAllForUser(@UserJwt() user: TUserJwt) {
    return await this.transfersService.findAllForUser(user.sub);
  }

  @Post()
  async transferMoney(
    @UserJwt() user: TUserJwt,
    @Body() transferDto: TransferDto,
  ) {
    return await this.transfersService.transferMoney(transferDto);
  }
}
