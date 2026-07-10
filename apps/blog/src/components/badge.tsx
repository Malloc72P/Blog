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
          ? // 활성/primary 강조: 무채색 채움(테마별 반전으로 라이트는 근검정+흰 텍스트, 다크는 근백색+어두운 텍스트) — 검정 헤더와 한 시스템으로 통일.
            'bg-gray-900 text-surface'
          : 'bg-gray-100 text-gray-700',
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
