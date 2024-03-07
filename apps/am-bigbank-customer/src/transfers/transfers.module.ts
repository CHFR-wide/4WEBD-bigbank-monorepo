import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountsModule } from 'src/bank-accounts/bank-accounts.module';
import { TEnvironmentValues } from 'src/environment';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [
    BankAccountsModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'NOTIFICATION_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const env = configService.get<TEnvironmentValues>('env');

            return {
              transport: Transport.TCP,
              options: {
                host: env.msNotification.host,
                port: +env.msNotification.port,
              },
            };
          },
        },
      ],
    }),
    UsersModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService, PrismaService],
})
export class TransfersModule {}
