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
        'px-[8px] py-[6px]',
        'md:px-[12px]',
        'whitespace-nowrap',
        color === 'primary' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700',
        'hover:brightness-95 active:brightness-90',
      )}
    >
      <Link href={href} className="text-[10px] md:text-[16px]" onClick={onBadgeClick}>
        {children}
      </Link>
    </span>
  );
}
