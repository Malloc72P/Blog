import { Catch, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AccessTokenExpiredException } from '@src/exceptions/access-token-expired.exception';

@Catch()
export class LoggingExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);
  private readonly WHITELIST = [
    UnauthorizedException.name,
    NotFoundException.name,
    AccessTokenExpiredException.name,
  ];

  catch(exception: any, host: any) {
    super.catch(exception, host);

    if (this.isWhitelisted(exception)) {
      return;
    }

    this.logger.error(`Exception: ${exception.message}`, exception.stack);

    if (exception.origin) {
      this.logger.error('origin error: ', exception.origin?.message);
    }
  }

  private isWhitelisted(exception: any) {
    return this.WHITELIST.some((white) => white === exception?.name);
  }
}
