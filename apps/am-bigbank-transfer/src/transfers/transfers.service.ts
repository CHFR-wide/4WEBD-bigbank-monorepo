import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/db-access/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  async create(transfer: TransferDto) {
    return await this.prismaService.transfer.create({
      data: transfer,
    });
  }

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccountId: userId }, { toAccountId: userId }] },
    });
  }
}
