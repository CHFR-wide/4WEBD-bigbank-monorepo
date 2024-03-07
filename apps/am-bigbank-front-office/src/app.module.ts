import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import {
  TEnvironmentValues,
  environmentValidationSchema,
  environmentValues,
} from './environment';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { TransfersModule } from './transfers/transfers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentValues],
      validationSchema: environmentValidationSchema,
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const env = configService.get<TEnvironmentValues>('env');

        return {
          secret: env.jwtSecret,
          signOptions: { expiresIn: '30d' },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    UsersModule,
    BankAccountsModule,
    TransfersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
