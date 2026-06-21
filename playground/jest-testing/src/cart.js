// 비공개 헬퍼: 모듈 밖으로 export 하지 않는다.
// 할인율을 0~1 범위로 강제하는 내부 유틸이다.
function clampRate(rate) {
  // 음수면 0, 1보다 크면 1로 잘라낸다.
  if (rate < 0) return 0;
  if (rate > 1) return 1;
  return rate;
}

// 장바구니에 담긴 상품 목록의 합계를 계산한다.
// items: [{ name, price, quantity }]
export function calculateTotal(items) {
  // 빈 배열이 아니라 진짜 배열인지부터 확인한다.
  if (!Array.isArray(items)) {
    throw new TypeError('items는 배열이어야 합니다.');
  }
  // 각 항목의 price * quantity를 더해 총액을 만든다.
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 총액에 할인율을 적용한 결과를 리턴한다.
export function applyDiscount(total, rate) {
  // 비공개 헬퍼로 할인율을 안전한 범위로 보정한다.
  const safeRate = clampRate(rate);
  // 소수점 오차를 막기 위해 정수 단위로 반올림한다.
  return Math.round(total * (1 - safeRate));
}

// 단위 가격과 수량을 받아 장바구니 항목 객체를 만든다.
export function createItem(name, price, quantity = 1) {
  // 수량이 1보다 작으면 잘못된 입력으로 본다.
  if (quantity < 1) {
    throw new Error('수량은 1 이상이어야 합니다.');
  }
  // 항상 같은 모양의 객체를 리턴한다(toEqual 테스트에 유리).
  return { name, price, quantity };
}

// 테스트 전용 출구: 운영 빌드가 아닐 때만 비공개 함수를 노출한다.
// process.env.NODE_ENV는 Jest 실행 시 자동으로 'test'가 된다.
export const __testables__ =
  process.env.NODE_ENV === 'test' ? { clampRate } : undefined;
