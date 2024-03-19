import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/db-access/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransfersService {
  /**
   *
   */
  constructor(
    private prismaService: PrismaService,
    @Inject('RMQ_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  async create(transfer: TransferDto) {
    const res = await this.prismaService.transfer.create({
      data: transfer,
    });

    await Promise.all([
      firstValueFrom(
        this.notificationClient.send<boolean>(
          { cmd: 'notify-mobile' },
          {
            phoneNumber: 'sender.phoneNumber',
            content: `Your transfer of ${'transferDto.amount'} has succeeded`,
          },
        ),
      ),
      firstValueFrom(
        this.notificationClient.send<boolean>(
          { cmd: 'notify-mobile' },
          {
            phoneNumber: 'recipient.phoneNumber',
            content: `You have received a transfer of ${'transferDto.amount'}`,
          },
        ),
      ),
    ]);

    return res;
  }

  async findAllForUser(userId: number) {
    return await this.prismaService.transfer.findMany({
      where: { OR: [{ fromAccountId: userId }, { toAccountId: userId }] },
    });
  }
}
