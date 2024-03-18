import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db-access/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(private prismaService: PrismaService) {}

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
