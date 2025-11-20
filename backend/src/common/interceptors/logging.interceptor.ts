import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, ip, headers, body } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    const sanitizedBody = this.sanitizeBody(body);

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (Object.keys(sanitizedBody).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `Outgoing Response: ${method} ${originalUrl} - Status: ${response.statusCode} - Duration: ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Request Failed: ${method} ${originalUrl} - Status: ${error.status || 500} - Duration: ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }

  private sanitizeBody(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {};
    }

    const sanitized = { ...(body as Record<string, unknown>) };

    if (sanitized.password) {
      sanitized.password = '***REDACTED***';
    }

    return sanitized;
  }
}
