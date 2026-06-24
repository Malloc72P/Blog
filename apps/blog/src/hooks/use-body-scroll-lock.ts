import { useEffect } from 'react';

// 사이드바·검색 모달 등 여러 오버레이가 각각 배경 스크롤을 잠그려 할 수 있다.
// 단순히 컴포넌트마다 overflow를 저장/복구하면 마지막에 닫힌 쪽이 다른 오버레이의
// 잠금까지 해제해버릴 수 있으므로, 모듈 단위 참조 카운트로 일원화한다.
let lockCount = 0;
// 최초로 잠그기 직전의 overflow 값. 마지막 잠금이 풀릴 때 이 값으로 복구한다.
let previousOverflow = '';

/**
 * locked가 true인 동안 document.body 스크롤을 잠근다.
 * 여러 컴포넌트가 동시에 호출해도 참조 카운트로 안전하게 동작하며,
 * 잠금 요청이 하나라도 남아 있으면 잠금을 유지하고 마지막 해제 시 원래 값으로 되돌린다.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    // 잠그지 않을 때는 카운트를 건드리지 않는다.
    if (!locked) return;

    // 0 -> 1, 즉 처음 잠그는 순간에만 원래 overflow를 저장하고 hidden으로 바꾼다.
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      // 마지막 잠금이 풀리는 순간에만 원래 값으로 복구한다.
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [locked]);
}
