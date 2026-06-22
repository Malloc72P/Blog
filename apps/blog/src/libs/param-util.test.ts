import { prepareParam } from '@libs/param-util';

describe('prepareParam', () => {
  it('누락된 키는 기본값으로 채운다', () => {
    expect(prepareParam<{ a: number; b: string }>({ a: 1 }, { a: 0, b: 'def' })).toEqual({
      a: 1,
      b: 'def',
    });
  });

  it('제공된 truthy 값은 유지한다', () => {
    expect(
      prepareParam<{ orderBy: string }>({ orderBy: 'createAtASC' }, { orderBy: 'latest' }),
    ).toMatchObject({ orderBy: 'createAtASC' });
  });

  it('falsy 값(0/빈문자)은 기본값으로 덮인다 — 알려진 동작', () => {
    // !Reflect.get(param, key)로 판단하므로 0/''는 "누락"으로 간주되어 기본값이 적용된다.
    expect(prepareParam<{ limit: number }>({ limit: 0 }, { limit: 5 })).toMatchObject({ limit: 5 });
  });
});
