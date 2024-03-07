import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(private prismaService: PrismaService) {}

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccount: { userId } }, { toAccount: { userId } }] },
    });
  }
}
