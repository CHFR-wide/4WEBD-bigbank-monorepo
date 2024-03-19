import { UsersTcpModule } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [UsersTcpModule],
  controllers: [UsersController],
})
export class UsersModule {}
