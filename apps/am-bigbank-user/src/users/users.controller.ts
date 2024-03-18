import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from 'prisma-client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  /**
   *
   */
  constructor(private usersService: UsersService) {}

  @MessagePattern({ cmd: 'user-create' })
  async create(data: Prisma.UserCreateInput) {
    const user = await this.usersService.create(data);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @MessagePattern({ cmd: 'user-findOne' })
  async findOne(data: { id: number }) {
    const user = await this.usersService.findOne(data.id);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @MessagePattern({ cmd: 'user-findOneByEmail' })
  async findOneByEmail(data: { email: string }) {
    const user = await this.usersService.findOneByEmail(data.email);

    return user;
  }

  @MessagePattern({ cmd: 'user-update' })
  async update(data: { id: number; update: UpdateUserDto }) {
    const { password, ...safeUser } = await this.usersService.update(
      data.id,
      data.update,
    );

    return safeUser;
  }

  @MessagePattern({ cmd: 'user-delete' })
  async delete(data: { id: number }) {
    const { password, ...safeUser } = await this.usersService.remove(data.id);

    return safeUser;
  }
}
