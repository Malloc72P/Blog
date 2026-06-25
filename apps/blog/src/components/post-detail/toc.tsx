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

  // fragId가 바뀔 때만 스크롤 이동 콜백을 호출한다.
  // onFragIdChanged는 부모(PostDetail)에서 매 렌더마다 새로 생성되는 인라인 콜백이라
  // 의존성에 넣으면 부모 리렌더마다 effect가 재실행되어 의도치 않은 scrollIntoView가 발생한다.
  useEffect(() => {
    if (!fragId) {
      return;
    }

    onFragIdChanged({ fragId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragId]);

  return (
    /* 폭을 240px로 두어 xl(1280px) 거터 안에 들어가 가로 스크롤이 생기지 않게 한다. */
    <div className="w-[240px] mt-[200px]">
      <ol className="flex flex-col gap-4 p-4 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            className={classNames(
              'list-decimal',
              // h3는 하위 항목이므로 들여쓰기로 계층을 표현한다.
              item.level === 3 ? 'ml-4' : '',
            )}
          >
            {/* a[href]로 키보드 포커스·Enter 이동·딥링크·스크린리더 접근을 동시에 얻는다. */}
            <a
              href={`#${item.id}`}
              // 현재 위치한 항목임을 스크린리더에 알린다.
              aria-current={item.id === activeId ? 'location' : undefined}
              onClick={(e) => {
                // 네이티브 즉시 점프를 막고 기존의 부드러운 스크롤(scrollIntoView smooth)을 유지한다.
                e.preventDefault();
                setFragId(item.id);
                // 딥링크를 위해 스크롤 없이 URL 해시만 동기화한다.
                window.history.replaceState(null, '', `#${item.id}`);
              }}
              className={classNames(
                'block hover:underline focus-visible:underline',
                // 비활성 항목은 흐리게 두되, 키보드 포커스 시에는 또렷하게 보이도록 한다.
                item.id === activeId
                  ? 'opacity-100'
                  : 'opacity-30 hover:opacity-50 focus-visible:opacity-100',
              )}
            >
              {item.value}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
