'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 링크 href가 현재 경로인지 판정하는 함수를 돌려준다.
 *
 * 헤더 드롭다운·푸터·모바일 사이드바가 같은 기준으로 활성 항목을 고르고 aria-current를
 * 부여하도록 판정을 한 곳에 둔다. 판정 방식(쿼리스트링 무시, prefix 매칭 등)을 바꿀 일이
 * 생기면 여기만 고친다.
 */
export function useActivePath() {
  const pathname = usePathname();

  return useCallback((href?: string) => href === pathname, [pathname]);
}
