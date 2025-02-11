////////////////////////////////////////////////////////////////////////////////
// auth.guard.ts
// 2024. 11. 22. created by Malloc72P
// -----------------------------------------------------------------------------
// Copyright (c) 2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenExpiredException } from '@src/exceptions/access-token-expired.exception';

/**
 * Local, JWT Strategy를 사용하여 토큰 검사
 * 토큰검사 전략을 사용하는 Guard 데코레이터를 여기서 작성
 *
 * Guard 객체는 추가적인 인증 허가 로직을 적용할 수 있다.(canActivate)
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any
  ) {
    if (err || !user) {
      throw new AccessTokenExpiredException();
    }

    return user;
  }
}
