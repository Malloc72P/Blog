import { calculateTotal, applyDiscount } from './cart.js';

// 결제를 진행하는 함수. 실제 결제 API(pay)를 주입받아 호출한다.
// 의존성을 인자로 받으면 테스트에서 가짜 함수(mock)로 갈아끼우기 쉽다.
export async function checkout(items, rate, pay) {
  // 장바구니 합계를 구하고 할인을 적용한다.
  const total = calculateTotal(items);
  const finalPrice = applyDiscount(total, rate);
  // 주입받은 결제 함수를 호출한다. Promise를 리턴한다고 가정한다.
  const receipt = await pay(finalPrice);
  // 결제 결과에 최종 금액을 함께 담아 돌려준다.
  return { ...receipt, finalPrice };
}
