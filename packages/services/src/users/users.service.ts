import { SignUpDto, UpdateUserDto } from '@ambigbank/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  async create(user: SignUpDto) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'user-create' }, user),
    );
  }

  async findOne(id: number) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'user-findOne' }, { id }).pipe(
        catchError((e) => {
          throw e;
        }),
      ),
    );
  }

  async findOneByEmail(email: string) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'user-findOneByEmail' }, { email }),
    );
  }

  async update(id: number, update: UpdateUserDto) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'user-update' }, { id, update }),
    );
  }

  async remove(id: number) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'user-delete' }, { id }),
    );
  }
}
