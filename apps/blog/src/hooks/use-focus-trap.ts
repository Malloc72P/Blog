import { KeyboardEvent, RefObject, useCallback } from 'react';

// 포커스를 받을 수 있는 요소를 고르는 셀렉터.
// 모달성 오버레이(사이드바·검색·목차 시트)가 같은 기준으로 트랩 경계를 잡도록 한 곳에 둔다.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/**
 * Tab 포커스를 컨테이너 안에 가두는 키다운 핸들러를 만든다(포커스 트랩).
 *
 * 마지막 요소에서 Tab을 누르면 처음으로, 처음에서 Shift+Tab을 누르면 마지막으로 순환시킨다.
 * Tab이 아닌 키는 건드리지 않으므로, Esc·화살표 등 다른 키를 처리하는 핸들러 안에서
 * 함께 호출해도 된다.
 *
 * 배경 격리(스크롤 잠금·inert)는 useModalA11y가 맡는다. 두 훅은 짝으로 쓰인다.
 */
export function useFocusTrap<T extends HTMLElement>(containerRef: RefObject<T | null>) {
  return useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus(); // 처음에서 Shift+Tab → 마지막으로 순환
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus(); // 마지막에서 Tab → 처음으로 순환
      }
    },
    [containerRef],
  );
}
