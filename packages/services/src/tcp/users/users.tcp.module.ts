
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersTcpService } from './users.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TCP_MS_USER',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('MS_USER_HOST'),
            port: +configService.getOrThrow('MS_USER_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UsersTcpService],
  exports: [UsersTcpService],
})
export class UsersTcpModule {}
