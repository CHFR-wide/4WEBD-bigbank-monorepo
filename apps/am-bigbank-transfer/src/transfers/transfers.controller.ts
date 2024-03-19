import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ETransferStatus } from 'prisma-client';
import { TransferDto } from './dto/transfer.dto';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @MessagePattern({ cmd: 'transfer-findAllForUser' })
  async findAllForUser(data: { userId: number }) {
    return await this.transfersService.findAllForUser(data.userId);
  }

  @MessagePattern({ cmd: 'transfer-create' })
  async create(data: { transfer: TransferDto }) {
    return await this.transfersService.create(data.transfer);
  }

  @MessagePattern({ cmd: 'transfer-status-done' })
  async validateTransfer(data: { id: number }) {
    return await this.transfersService.update(data.id, {
      status: ETransferStatus.DONE,
    });
  }

  @MessagePattern({ cmd: 'transfer-status-error' })
  async errorTransfer(data: { id: number }) {
    return await this.transfersService.update(data.id, {
      status: ETransferStatus.ERROR,
    });
  }
}
