import { Expose } from 'class-transformer';

export class RefreshTokenParam {}

export class RefreshTokenResult {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  issuedAt: number;

  @Expose()
  expiredAt: number;
}
