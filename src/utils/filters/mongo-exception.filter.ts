import { Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(Error)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error & { errors: MongooseError[] },
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: Object.entries(exception.errors).map(([idx, v]) => ({
        name: idx,
        errors: [v.message],
      })),
      error: 'Bad Request',
    });
  }
}
