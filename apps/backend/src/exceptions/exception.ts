import { HttpException } from '@nestjs/common';
import { ApiExceptionPayload } from '@repo/exceptions';

export type ApiExceptionProps = ApiExceptionPayload & {
  error?: Error;
};

export class ApiException extends HttpException {
  originError?: Error;
  constructor({
    code = 'Unknown',
    status = 500,
    message = '알 수 없는 에러가 발생했습니다.',
    error,
  }: ApiExceptionProps) {
    const payload: ApiExceptionPayload = {
      code,
      message,
      status,
    };

    super(payload, status);

    if (error) {
      this.originError = error;
    }
  }
}
