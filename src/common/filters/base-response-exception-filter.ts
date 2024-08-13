import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * This
 */
@Catch(HttpException)
export class BaseResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (response.headersSent) {
      return;
    }

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      status: 'error',
      message: (exceptionResponse as any).message,
      data: null,
    });
  }
}
