'use client';

import { MyLink } from '@/components/my-link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

export function Back() {
  const pathname = usePathname();

  return (
    <div className={classNames('mb-5', pathname === '/' ? 'hidden' : 'block')}>
      <MyLink href="/">⬅️ 뒤로 가기</MyLink>
    </div>
  );
}
