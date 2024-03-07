import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    let transformedException: Error = exception;
    const code = exception.code;
    let message: string;

    switch (code) {
      case PrismaError.RecordsNotFound:
        transformedException = new NotFoundException();
        break;
      case PrismaError.UniqueConstraintViolation:
        const conflicts = exception.meta.target as string[];
        message = `${conflicts.join(', ')} already in use`;
        transformedException = new ConflictException(message);
        break;
      case PrismaError.ForeignConstraintViolation:
        const foreignField = exception.meta.field_name as string;
        message = `Foreign constraint error on field ${foreignField}`;
        transformedException = new BadRequestException(message);
        break;
    }
    super.catch(transformedException, host);
  }
}
