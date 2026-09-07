'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// 복사 성공 표시를 유지하는 시간(ms).
const COPIED_FEEDBACK_MS = 1500;

/**
 * 텍스트를 클립보드에 쓰고, 성공하면 잠시 동안 copied를 true로 유지한다.
 *
 * 코드블록 복사 버튼과 글 공유 버튼이 같은 피드백 동작을 쓰므로 한 곳에 모은다.
 * 클립보드 접근이 거부된 환경(비 HTTPS, 권한 거부)에서는 예외를 흡수해 화면이 깨지지 않게 한다.
 *
 * 언마운트 뒤 상태를 되돌리려다 경고가 나지 않도록 남은 타이머를 정리한다.
 */
export function useCopyToClipboard(feedbackMs: number = COPIED_FEEDBACK_MS) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        // 연속으로 눌러도 마지막 클릭 기준으로 피드백이 유지되도록 이전 타이머를 지운다.
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), feedbackMs);
      } catch {
        // 클립보드 접근이 거부된 환경에서는 조용히 무시한다.
      }
    },
    [feedbackMs],
  );

  return { copied, copy };
}
