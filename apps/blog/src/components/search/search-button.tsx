'use client';

import classNames from 'classnames';
import { IconSearch } from '@tabler/icons-react';
import { useSearch } from './search-context';

interface SearchButtonProps {
  className?: string;
}

/** 헤더에서 검색 모달을 여는 아이콘 버튼 */
export function SearchButton({ className }: SearchButtonProps) {
  const { open } = useSearch();

  return (
    <button
      onClick={open}
      aria-label="포스트 검색 열기"
      className={classNames('flex cursor-pointer items-center', className)}
    >
      <IconSearch className="h-5 w-5" />
    </button>
  );
}
