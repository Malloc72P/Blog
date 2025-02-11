import { ApiException } from './exception';

export class EmailAlreadyInUse extends ApiException {
  constructor() {
    super({
      code: 'EmailAlreadyInUse',
      message: '이미 존재하는 사용자입니다. 다른 이메일을 사용해주세요.',
      status: 409,
    });
  }
}
