import { UsersService } from '@ambigbank/services';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MobileNotificationsController } from './mobile-notifications.controller';
import { MobileNotificationsService } from './mobile-notifications.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'USERS_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: configService.getOrThrow('MS_USER_HOST'),
                port: +configService.getOrThrow('MS_USER_PORT'),
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [MobileNotificationsController],
  providers: [MobileNotificationsService, UsersService],
})
export class MobileNotificationsModule {}
