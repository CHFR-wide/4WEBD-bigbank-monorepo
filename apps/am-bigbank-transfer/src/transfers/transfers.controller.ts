import { ETransferError, ETransferStatus } from '@ambigbank/services';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @MessagePattern({ cmd: 'transfer-findAllForUser' })
  async findAllForUser(data: { userId: number }) {
    return await this.transfersService.findAllForUser(data.userId);
  }

  @MessagePattern({ cmd: 'transfer-create' })
  async create(data: {
    userId: number;
    transfer: { fromAccountId: number; toAccountId: number; amount: number };
  }) {
    return await this.transfersService.create(data.userId, data.transfer);
  }

  @EventPattern({ cmd: 'transfer-ack' })
  async validateTransfer(data: {
    id: number;
    status: ETransferStatus;
    error?: ETransferError;
  }) {
    return await this.transfersService.update(data.id, {
      status: data.status,
      ...(data.error && { error: data.error }),
    });
  }
}
