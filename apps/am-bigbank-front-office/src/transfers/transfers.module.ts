import { TransfersTcpModule } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';

@Module({
  imports: [TransfersTcpModule],
  controllers: [TransfersController],
})
export class TransfersModule {}
