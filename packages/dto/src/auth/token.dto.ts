export class TokenPayload {
  exp: number; // expired at. jwt가 만료될 시간을 나타낸다.
  iat: number; // issued at. jwt가 생성된 시간을 나타낸다
}

export class AccessTokenPayload extends TokenPayload {
  id: number;
  email: string;
  isAdmin: boolean;
}

export class RefreshTokenPayload extends TokenPayload {
  id: number;
  email: string;
}
