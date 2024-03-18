import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from 'prisma-client';
import { throwError } from 'rxjs';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionWrapper extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    console.log(exception);
    return throwError(() => new RpcException(exception));
  }
}
