import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedTokenInfo } from '@src/token/token.service.dto';

export interface IRequester {
  id: string;
  email: string;
  role: string;
}

export const Requester = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IRequester => {
    const request = ctx.switchToHttp().getRequest();

    const payload = request.user as DecodedTokenInfo;

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
);
