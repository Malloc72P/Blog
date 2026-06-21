import { checkout } from './checkout.js';

describe('checkout (비동기 + mock)', () => {
  let items;

  beforeEach(() => {
    items = [{ name: '커피', price: 5000, quantity: 2 }];
  });

  it('결제 함수에 할인된 최종 금액을 넘겨 호출한다', async () => {
    // jest.fn()으로 가짜 결제 함수를 만든다. 호출 기록이 남는다.
    const pay = jest.fn().mockResolvedValue({ ok: true, id: 'ORDER-1' });

    // 10000원에서 10% 할인 -> 9000원
    const result = await checkout(items, 0.1, pay);

    // pay가 9000원으로 정확히 한 번 호출됐는지 검증한다.
    expect(pay).toHaveBeenCalledTimes(1);
    expect(pay).toHaveBeenCalledWith(9000);
    // 리턴된 영수증에 최종 금액이 합쳐졌는지 확인한다.
    expect(result).toEqual({ ok: true, id: 'ORDER-1', finalPrice: 9000 });
  });

  it('결제 함수가 거부되면 그 에러가 그대로 전파된다', async () => {
    // 이번에는 결제가 실패하는 상황을 흉내 낸다.
    const pay = jest.fn().mockRejectedValue(new Error('카드 한도 초과'));

    // 비동기 함수의 reject는 rejects 매처로 잡는다.
    await expect(checkout(items, 0, pay)).rejects.toThrow('카드 한도 초과');
  });
});
