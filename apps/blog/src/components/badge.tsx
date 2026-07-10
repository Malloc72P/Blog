import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export interface BadgeProps extends PropsWithChildren {
  onClick?: () => void;
  href: string;
  color?: 'primary' | 'secondary';
  // 현재 선택된(활성) 필터 여부. 보조기술에 현재 항목임을 알리기 위해 aria-current로 연결된다.
  active?: boolean;
}

export function Badge({ href, children, onClick, color = 'secondary', active }: BadgeProps) {
  const onBadgeClick = onClick
    ? (e: React.MouseEvent) => {
        e.preventDefault();

        onClick();
      }
    : undefined;

  return (
    <span
      className={classNames(
        'rounded-md flex items-center justify-center font-bold',
        'transition-all duration-200 ease-in-out',
        // 모바일 탭 영역 확보를 위해 세로 패딩을 키운다(데스크톱은 기존 유지).
        'px-[8px] py-[8px]',
        'md:px-[12px] md:py-[6px]',
        'whitespace-nowrap',
        color === 'primary'
          ? 'bg-brand-strong text-white'
          : // secondary(태그 뱃지·비활성 시리즈 칩): 다크에서만 얇은 인셋 링으로 보강한다.
            // - 링은 box-shadow 기반이라 레이아웃에 영향이 없어 라이트 모드는 100% 그대로 유지된다(border는 칩이 2px 커짐).
            // - dark:ring-white/10: 다크 배경(#2b2d31)과 명도차가 작아 묻히던 칩을 살짝 띄워 준다.
            // - dark:hover:ring-white/25: hover 시 링을 더 밝게 해 '눌러지는 링크'임을 알린다(무채색 시스템 유지 — 인디고 미사용, 라이트 hover는 기존 brightness).
            'bg-gray-100 text-gray-700 dark:ring-1 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/25',
        'hover:brightness-95 active:brightness-90',
      )}
    >
      {/* 모바일 가독성을 위해 폰트를 12px로 올린다(데스크톱은 기존 16px 유지). */}
      {/* 활성 필터일 때만 aria-current="true"를 부여해 보조기술에 현재 선택 항목임을 알린다. */}
      <Link
        href={href}
        className="text-[12px] md:text-[16px]"
        onClick={onBadgeClick}
        aria-current={active ? 'true' : undefined}
      >
        {children}
      </Link>
    </span>
  );
}
