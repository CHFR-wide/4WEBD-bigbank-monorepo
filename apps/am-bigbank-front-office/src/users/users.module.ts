import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TEnvironmentValues } from 'src/environment';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'USERS_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const env = configService.get<TEnvironmentValues>('env');

            console.log(env);

            return {
              transport: Transport.TCP,
              options: {
                host: env.msUser.host,
                port: +env.msUser.port,
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
