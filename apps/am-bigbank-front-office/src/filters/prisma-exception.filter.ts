import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaError } from 'prisma-error-enum';

@Catch()
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let transformedException: Error = exception;
    const code = exception.error?.code;
    let message: string;

    switch (code) {
      case PrismaError.RecordsNotFound:
        transformedException = new NotFoundException(exception.message);
        break;
      case PrismaError.UniqueConstraintViolation:
        const conflicts = exception.error?.meta.target as string[];
        message = `Field ${conflicts.join(', ')} already in use`;
        transformedException = new ConflictException(message);
        break;
      case PrismaError.ForeignConstraintViolation:
        const foreignField = exception.error?.meta.field_name as string;
        message = `Foreign constraint error on field ${foreignField}`;
        transformedException = new BadRequestException(message);
        break;
    }
    super.catch(transformedException, host);
  }
}
