import { AccessTokenPayload, RefreshTokenPayload } from '@repo/dto';

//-------------------------------------------------------------------------
// signAccessToken
//-------------------------------------------------------------------------
export interface TokenServiceSignAccessTokenInput {
  id: string;
  email: string;
  role: string;
}

export interface TokenServiceSignAccessTokenOutput {
  accessToken: string;
}

//-------------------------------------------------------------------------
// signRefreshToken
//-------------------------------------------------------------------------
export interface TokenServiceSignRefreshTokenInput {
  id: string;
  email: string;
  role: string;
}

export interface TokenServiceSignRefreshTokenOutput {
  refreshToken: string;
}

//-------------------------------------------------------------------------
// decodeAccessToken
//-------------------------------------------------------------------------
export interface DecodedTokenInfo {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface TokenServiceDecodeAccessTokenInput {
  token: string;
}

export interface TokenServiceDecodeAccessTokenOutput {
  accessTokenPayload: DecodedTokenInfo;
}

//-------------------------------------------------------------------------
// decodeRefreshToken
//-------------------------------------------------------------------------
export interface TokenServiceDecodeRefreshTokenInput {
  token: string;
}

export interface TokenServiceDecodeRefreshTokenOutput {
  refreshTokenPayload: DecodedTokenInfo;
}
