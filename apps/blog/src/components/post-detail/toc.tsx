'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';

/** 목차 한 항목. 본문 헤딩에서 수집한 id/텍스트/레벨을 담는다. */
export interface TocItem {
  id: string;
  value: string;
  level: number;
}

export interface TocProps {
  toc: TocItem[];
  activeId: string;
  onFragIdChanged: (param: { fragId: string }) => void;
}

export function Toc({ toc, activeId, onFragIdChanged }: TocProps) {
  const [fragId, setFragId] = useState('');

  /**
   * url의 Fragment Identifier를 읽어서 상태로 저장함.
   */
  useEffect(() => {
    if (window.location.hash) {
      setFragId(window.location.hash);
    }
  }, []);

  useEffect(() => {
    if (!fragId) {
      return;
    }

    onFragIdChanged({ fragId });
  }, [fragId]);

  return (
    /* 폭을 240px로 두어 xl(1280px) 거터 안에 들어가 가로 스크롤이 생기지 않게 한다. */
    <div className="w-[240px] mt-[200px]">
      <ol className="flex flex-col gap-4 p-4 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              setFragId(item.id);
            }}
            className={classNames(
              'hover:cursor-pointer hover:underline list-decimal',
              // h3는 하위 항목이므로 들여쓰기로 계층을 표현한다.
              item.level === 3 ? 'ml-4' : '',
              item.id === activeId ? 'opacity-100' : 'opacity-30 hover:opacity-50',
            )}
          >
            {item.value}
          </li>
        ))}
      </ol>
    </div>
  );
}
