import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export interface BadgeProps extends PropsWithChildren {
  onClick?: () => void;
  href: string;
  color?: 'primary' | 'secondary';
}

export function Badge({ href, children, onClick, color = 'secondary' }: BadgeProps) {
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
        color === 'primary' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700',
        'hover:brightness-95 active:brightness-90',
      )}
    >
      {/* 모바일 가독성을 위해 폰트를 12px로 올린다(데스크톱은 기존 16px 유지). */}
      <Link href={href} className="text-[12px] md:text-[16px]" onClick={onBadgeClick}>
        {children}
      </Link>
    </span>
  );
}
