import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

type TExceptionResponse = {
  error: string;
  message: string | string[];
  statusCode: number;
};

/**
 * This filter is used to catch all exceptions that are thrown in the application
 * and return a consistent response format.
 *
 * This is used globally in the main application file.
 * by adding `app.useGlobalFilters(new BaseResponseExceptionFilter());`
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
    const exceptionResponse = exception.getResponse() as TExceptionResponse;

    let message: string = '';
    if (typeof exceptionResponse.message === 'string') {
      message = exceptionResponse.message;
    } else {
      message = exceptionResponse.message[0];
    }

    response.status(status).json({
      status: 'error',
      message,
      data: null,
    });
  }
}
