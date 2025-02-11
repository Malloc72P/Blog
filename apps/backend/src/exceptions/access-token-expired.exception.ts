import { ApiException } from './exception';

export class AccessTokenExpiredException extends ApiException {
  constructor() {
    super({
      code: 'AccessTokenExpired',
      message: '토큰이 만료되었습니다.',
      status: 403,
    });
  }
}
