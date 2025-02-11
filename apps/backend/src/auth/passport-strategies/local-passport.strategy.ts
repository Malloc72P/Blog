////////////////////////////////////////////////////////////////////////////////
// local.strategy.ts
// 2024. 11. 22. created by Malloc72P
// -----------------------------------------------------------------------------
// Copyright (c) 2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthServiceValidateUserOutput } from '../auth.service.dto';

/**
 * 이메일 패스워드로 로그인 여부를 검사하는 전략.
 */
@Injectable()
export class LocalPassportStrategy extends PassportStrategy(Strategy) {
  constructor(protected authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AuthServiceValidateUserOutput> {
    const validateResult = await this.authService.validateUser({
      email,
      password,
    });

    if (!validateResult) {
      throw new UnauthorizedException();
    }

    return validateResult;
  }
}
