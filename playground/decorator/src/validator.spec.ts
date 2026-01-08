import { describe, it, expect } from 'vitest';
import { MinLength, validate } from './validator';

class Example {
  @MinLength({ length: 3, message: '이름은 최소 ${length}자 이상이어야 합니다.' })
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

describe('Validator', () => {
  it('문자열 길이가 MinLength를 만족하면 에러를 발생시키지 않아야 함', () => {
    const example = new Example('Ina');
    expect(() => validate(example)).not.toThrow();
    // console: 유효성 검사를 통과했습니다.
  });

  it('문자열 길이가 MinLength를 어기면 에러를 발생시켜야 함', () => {
    const example = new Example('MO');
    expect(() => validate(example)).toThrow();
    // console: 이름은 최소 3자 이상이어야 합니다.
  });
});
