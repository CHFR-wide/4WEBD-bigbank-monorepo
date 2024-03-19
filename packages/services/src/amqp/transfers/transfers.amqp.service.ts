import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export enum ETransferStatus {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export enum ETransferError {
  SENDER_ACCOUNT_NOT_FOUND = 'SENDER_ACCOUNT_NOT_FOUND',
  RECIPIENT_ACCOUNT_NOT_FOUND = 'RECIPIENT_ACCOUNT_NOT_FOUND',
  SENDER_ACCOUNT_NOT_OWNER = 'SENDER_ACCOUNT_NOT_OWNER',
  SENDER_ACCOUNT_NOT_ENOUGH_FUNDS = 'SENDER_ACCOUNT_NOT_ENOUGH_FUNDS',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
}

@Injectable()
export class TransfersAmqpService {
  /**
   *
   */
  constructor(@Inject('RMQ_MS_TRANSFER') private transferClient: ClientProxy) {}

  async ackTransfer(id: number, status: ETransferStatus, error?: ETransferError) {
    const data = {id, status, error}

    return await firstValueFrom(
      this.transferClient.emit({ cmd: 'transfer-ack' }, data),
    );
  }
}
