import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInParam {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInResult {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  issuedAt: number;

  @Expose()
  expiredAt: number;
}
