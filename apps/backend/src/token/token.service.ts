import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  TokenServiceDecodeAccessTokenInput,
  TokenServiceDecodeAccessTokenOutput,
  TokenServiceSignAccessTokenInput,
  TokenServiceSignAccessTokenOutput,
  TokenServiceSignRefreshTokenInput,
  TokenServiceSignRefreshTokenOutput,
} from './token.service.dto';
import { TokenConfig } from '@src/config/app.config';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<TokenConfig>
  ) {}

  async signAccessToken(
    payload: TokenServiceSignAccessTokenInput
  ): Promise<TokenServiceSignAccessTokenOutput> {
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async signRefreshToken(
    payload: TokenServiceSignRefreshTokenInput
  ): Promise<TokenServiceSignRefreshTokenOutput> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('refresthSecret'),
      expiresIn: this.configService.get('refreshExpireIn'),
    });

    return { refreshToken };
  }

  decodeAccessToken({
    token,
  }: TokenServiceDecodeAccessTokenInput): TokenServiceDecodeAccessTokenOutput {
    const payload = this.jwtService.decode(token);

    return { accessTokenPayload: payload };
  }

  decodeRefreshToken({
    token,
  }: TokenServiceDecodeAccessTokenInput): TokenServiceDecodeAccessTokenOutput {
    const payload = this.jwtService.decode(token);

    return { accessTokenPayload: payload };
  }
}
