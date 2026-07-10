import { useEffect, useRef, useState } from 'react';
import { useBodyScrollLock } from './use-body-scroll-lock';

// 여러 모달이 동시에 열릴 수 있다(예: 사이드바가 열린 채 Cmd+K로 검색을 열 때).
// "누가 어떤 요소를 inert로 만들었는지" 참조 카운트로 추적해, 먼저 열린 모달이 표시해 둔
// inert를 나중에 닫히는 모달이 실수로 지우지 않게 한다(useBodyScrollLock과 동일한 패턴).
// hadInert: 첫 마킹 시점에 이미 inert였는지(예: 닫힌 시트 래퍼에 React가 부여한 inert)를
// 기억해, 해제 시 이 훅이 부여하지 않은 inert까지 지우지 않게 한다(#85 리뷰).
const inertRefCounts = new Map<Element, { count: number; hadInert: boolean }>();

function markInert(el: Element) {
  const entry = inertRefCounts.get(el);
  if (!entry) {
    // 첫 마킹: 원래 inert 여부를 스냅샷한 뒤 inert를 부여한다(이미 있으면 사실상 no-op).
    inertRefCounts.set(el, { count: 1, hadInert: el.hasAttribute('inert') });
    el.setAttribute('inert', '');
    return;
  }
  entry.count += 1;
}

function unmarkInert(el: Element) {
  const entry = inertRefCounts.get(el);
  // 마킹된 적 없는 요소는 건드리지 않는다(외부에서 부여한 inert 보호).
  if (!entry) return;
  if (entry.count <= 1) {
    inertRefCounts.delete(el);
    // 원래부터(React 등 외부에서) inert였던 요소는 속성을 그대로 남긴다.
    if (!entry.hadInert) el.removeAttribute('inert');
  } else {
    entry.count -= 1;
  }
}

/**
 * 모달성 오버레이(사이드바·검색 모달)가 공유하는 배경 격리 훅(#106).
 *
 * - body 스크롤 잠금(참조 카운트 기반, useBodyScrollLock 재사용)
 * - 열린 동안 dialogRef가 가리키는 요소를 제외한 document.body의 다른 직계 자식 전부에
 *   inert를 적용한다. 물리적 Tab 트랩만으로는 막지 못하는 스크린리더 가상 커서/스와이프의
 *   배경 유입을 차단하기 위해서다. 닫히면 원래대로 복구한다.
 * - createPortal로 document.body에 렌더하기 위한 mounted 가드도 함께 제공한다(SSR엔 document가 없어
 *   하이드레이션 전에는 포털을 렌더할 수 없다).
 */
export function useModalA11y(open: boolean) {
  const [mounted, setMounted] = useState(false);
  // 포털로 document.body에 렌더되는 최상위 요소를 가리킨다. 이 요소 자신은
  // inert 대상에서 제외되며, Tab 포커스 트랩의 스캔 범위로도 재사용된다.
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const dialogEl = dialogRef.current;
    // mounted 이전에는 portal이 아직 렌더되지 않아 dialogEl이 없을 수 있다(SSR 직후 첫 커밋).
    // 이 effect는 mounted도 의존성에 포함하므로, mounted가 true로 바뀌는 다음 커밋에서
    // (open 값 자체는 그대로여도) 다시 실행되어 그때는 dialogEl을 정상적으로 찾는다.
    if (!dialogEl) return;

    // 이 다이얼로그 자신을 제외한 body의 다른 직계 자식들을 배경으로 간주해 inert 처리한다.
    const siblings = Array.from(document.body.children).filter((el) => el !== dialogEl);
    siblings.forEach(markInert);

    return () => {
      siblings.forEach(unmarkInert);
    };
  }, [open, mounted]);

  return { mounted, dialogRef };
}
