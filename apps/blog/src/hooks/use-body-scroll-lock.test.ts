import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './use-body-scroll-lock';

describe('useBodyScrollLock', () => {
  // 모듈 단위 카운트가 다른 테스트로 누수되지 않도록 body 스타일을 초기화한다.
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('locked=false면 body 스크롤을 잠그지 않는다', () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('locked=true면 잠그고, 해제(언마운트)되면 원래 값으로 복구한다', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('잠그기 직전의 overflow 값을 정확히 복구한다', () => {
    // 기본값('')이 아닌 값으로 시작해도 그대로 되돌려야 한다.
    document.body.style.overflow = 'scroll';

    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('두 소비자가 동시에 잠그면 마지막 하나가 풀릴 때까지 잠금을 유지한다(참조 카운트)', () => {
    const first = renderHook(() => useBodyScrollLock(true));
    const second = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    // 하나만 해제 → 아직 다른 소비자가 잠금을 요구하므로 유지된다.
    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    // 마지막 소비자까지 해제 → 비로소 복구된다.
    second.unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
