'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
}

/**
 * 라이트/다크 테마 전환 버튼.
 *
 * html.dark 클래스와 localStorage를 직접 토글한다. 초기 클래스는 layout <head>의
 * 인라인 스크립트가 paint 전에 설정하므로(FOUC 방지), 이 컴포넌트는 마운트 후
 * 현재 상태를 읽어 아이콘만 맞춘다.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  // aria-label(스크린리더 전용)만 상태로 관리한다. 보이는 아이콘은 아래 CSS(dark:)로 토글해
  // 첫 프레임부터 html.dark와 일치시킨다(아이콘 플래시 없음).
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // 프라이빗 모드 등 localStorage 접근이 막힌 환경은 조용히 무시한다.
    }
    // giscus 등 외부 위젯이 테마를 따라오도록 전역 이벤트로 알린다.
    window.dispatchEvent(new CustomEvent('themechange', { detail: next ? 'dark' : 'light' }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className={classNames(
        // 아이콘(20px)에 패딩을 더해 탭 영역을 ~44px로 확보한다.
        'flex cursor-pointer items-center p-2.5',
        // 다크 헤더 위에서 키보드 포커스가 보이도록 밝은 outline + offset을 부여한다.
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
        className,
      )}
    >
      {/* 라이트일 때 달(다크로 전환), 다크일 때 해(라이트로 전환). html.dark 클래스로 CSS 토글. */}
      <IconMoon aria-hidden className="h-5 w-5 block dark:hidden" />
      <IconSun aria-hidden className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
