import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransferDto } from './dto/transfer.dto';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @MessagePattern({ cmd: 'transfer-findAllForUser' })
  async findAllForUser(data: { userId: number }) {
    return await this.transfersService.findAllForUser(data.userId);
  }

  @MessagePattern({ cmd: 'transfer-Create' })
  async create(data: { transfer: TransferDto }) {
    return await this.transfersService.create(data.transfer);
  }
}
