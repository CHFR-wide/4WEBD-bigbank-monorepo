import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
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

  @Get('for-user/:id')
  async findAllForUser(@Param('id') userId: string) {
    return await this.transfersService.findAllForUser(+userId);
  }
}
