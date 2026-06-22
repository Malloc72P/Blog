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
      className={classNames(
        'flex cursor-pointer items-center',
        // 아이콘(20px)에 패딩을 더해 탭 영역을 ~44px로 확보한다(아이콘 크기는 유지).
        'p-2.5',
        // 다크 헤더 위에서 키보드 포커스가 보이도록 밝은 outline + offset을 부여한다.
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
        className,
      )}
    >
      <IconSearch className="h-5 w-5" />
    </button>
  );
}
