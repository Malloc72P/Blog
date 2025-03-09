import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export interface BadgeProps extends PropsWithChildren {
  onClick?: () => void;
  href: string;
  color?: 'primary' | 'secondary';
}

export function Badge({ href, children, onClick, color = 'primary' }: BadgeProps) {
  const onBadgeClick = onClick
    ? (e: React.MouseEvent) => {
        e.preventDefault();

        onClick();
      }
    : undefined;

  return (
    <span
      className={classNames(
        'rounded-md flex items-center justify-center bg-[#eee] text-gray-500 font-bold',
        'transition-all duration-200 ease-in-out',
        'px-[8px] py-[6px]',
        'md:px-[12px]',
        color === 'primary' ? '' : 'opacity-50'
      )}
    >
      <Link href={href} className="text-[10px] md:text-[16px]" onClick={onBadgeClick}>
        {children}
      </Link>
    </span>
  );
}
