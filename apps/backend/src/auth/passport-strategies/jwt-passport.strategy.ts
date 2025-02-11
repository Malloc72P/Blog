import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { CommonConstants } from '@repo/dto';
import { TokenConfig } from '@src/config/app.config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * 액세스 토큰으로 로그인 여부를 검사하는 전략
 */
@Injectable()
export class JwtPassportStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<TokenConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies[CommonConstants.token.accessTokenKey];
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('authSecret'),
    });
  }

  async validate(payload: any): Promise<any> {
    return payload;
  }
}
