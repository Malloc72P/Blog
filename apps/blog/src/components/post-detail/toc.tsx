'use client';

import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heading } from 'nextra';
import { useEffect, useState } from 'react';

export interface TocProps {
  toc: Heading[];
  activeId: string;
  onFragIdChanged: (param: { fragId: string }) => void;
}

export function Toc({ toc, activeId, onFragIdChanged }: TocProps) {
  const [fragId, setFragId] = useState('');

  /**
   * url의 Fragment Identifier를 읽어서 상태로 저장함.
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

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
    <div className="w-[320px] mt-[200px]">
      <ol className="flex flex-col gap-4 p-4 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              setFragId(item.id);
            }}
            className={classNames(
              'hover:cursor-pointer hover:underline list-decimal',
              item.id === activeId ? 'opacity-100' : 'opacity-30 hover:opacity-50'
            )}
          >
            {item.value}
          </li>
        ))}
      </ol>
    </div>
  );
}
