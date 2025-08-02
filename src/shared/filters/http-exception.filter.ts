import { Request, Response } from "express";
import { CustomError } from "../exceptions";
import { ErrorResponse } from "../types/api.response";
import { Catch, ExceptionFilter, Logger, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";
    let errors: Record<string, string> | undefined;
    let fields: string[] | undefined;

    if (exception instanceof CustomError) {
      status = exception.code;
      message = exception.message;
      errors = exception.errors;
      fields = exception.fields;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === "string" ? exceptionResponse : (exceptionResponse as any).message || "Error occured";
      errors =
        typeof exceptionResponse === "object" && exceptionResponse !== null ? (exceptionResponse as any).error : undefined;
      fields =
        typeof exceptionResponse === "object" && exceptionResponse !== null ? (exceptionResponse as any).fields : undefined;
    }
    // else if (exception instanceof QueryFailedError) {
    //   status = HttpStatus.BAD_REQUEST

    //   message = (exception as QueryFailedError).message
    //   errors = {
    //     message: (exception as any).detail
    //   }

    //   if ((exception as any).code === '23505') {
    //     status = HttpStatus.CONFLICT
    //     message = 'Resource already exists'
    //   }
    // }

    if (process.env.NODE_ENV !== "test") {
      this.logger.error({
        exception,
        message,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        body: request.body,
        query: request.query,
        params: request.params,
      });
    }

    const errorResponse: ErrorResponse = {
      code: status,
      message,
      ...(errors && { errors }),
      ...(fields && { fields }),
    };

    response.status(status).json(errorResponse);
  }
}
