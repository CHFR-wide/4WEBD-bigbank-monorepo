import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

type TUser = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  async create(user: TUser) {
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

  async update(id: number, update: Partial<TUser>) {
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
