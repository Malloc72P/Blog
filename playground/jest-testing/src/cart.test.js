import {
  calculateTotal,
  applyDiscount,
  createItem,
  __testables__,
} from './cart.js';

describe('calculateTotal', () => {
  // 매 테스트마다 새로 만들어 쓸 장바구니 데이터.
  let items;

  beforeEach(() => {
    // 테스트 사이에 데이터가 오염되지 않도록 매번 초기화한다.
    items = [
      { name: '사과', price: 1000, quantity: 3 },
      { name: '우유', price: 2500, quantity: 2 },
    ];
  });

  it('상품들의 가격과 수량을 곱해 합계를 구한다', () => {
    // 1000*3 + 2500*2 = 8000
    expect(calculateTotal(items)).toBe(8000);
  });

  it('빈 장바구니의 합계는 0이다', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('배열이 아닌 값을 넣으면 TypeError를 던진다', () => {
    // toThrow에 에러 타입이나 메시지 일부를 넘겨 검증할 수 있다.
    expect(() => calculateTotal(null)).toThrow(TypeError);
    expect(() => calculateTotal('장바구니')).toThrow('배열이어야');
  });
});

describe('applyDiscount', () => {
  it('할인율을 적용한 금액을 반올림해서 돌려준다', () => {
    // 10000원에서 10% 할인 -> 9000원
    expect(applyDiscount(10000, 0.1)).toBe(9000);
  });

  it('할인율이 1을 넘으면 1로 보정되어 0원이 된다', () => {
    expect(applyDiscount(10000, 1.5)).toBe(0);
  });

  it('음수 할인율은 0으로 보정되어 원금 그대로다', () => {
    expect(applyDiscount(10000, -0.3)).toBe(10000);
  });
});

describe('createItem', () => {
  it('이름, 가격, 수량을 담은 객체를 만든다', () => {
    // 객체 비교는 toBe(참조)가 아니라 toEqual(값)을 쓴다.
    expect(createItem('빵', 3000, 2)).toEqual({
      name: '빵',
      price: 3000,
      quantity: 2,
    });
  });

  it('수량을 생략하면 1로 채워진다', () => {
    expect(createItem('빵', 3000)).toEqual({
      name: '빵',
      price: 3000,
      quantity: 1,
    });
  });

  it('수량이 1 미만이면 에러를 던진다', () => {
    expect(() => createItem('빵', 3000, 0)).toThrow('1 이상');
  });
});

describe('비공개 헬퍼 clampRate (테스트 전용 출구로 접근)', () => {
  it('0~1 범위 밖의 값을 잘라낸다', () => {
    // __testables__는 NODE_ENV가 test일 때만 존재한다.
    expect(__testables__).toBeDefined();
    const { clampRate } = __testables__;
    expect(clampRate(-1)).toBe(0);
    expect(clampRate(0.4)).toBe(0.4);
    expect(clampRate(2)).toBe(1);
  });
});
