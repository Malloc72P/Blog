'use client';

import classNames from 'classnames';

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
  /** 컨테이너 클래스 오버라이드. 모바일 바텀시트(#85)처럼 사이드 패널 폭이 맞지 않는 곳에서 사용한다. */
  className?: string;
}

/* 기본 컨테이너: 폭을 240px로 두어 xl(1280px) 거터 안에 들어가 가로 스크롤이 생기지 않게 한다. */
const defaultClassName = 'w-[240px] mt-[200px]';

export function Toc({ toc, activeId, onFragIdChanged, className = defaultClassName }: TocProps) {
  // 해시 딥링크 스크롤은 이 컴포넌트가 데스크톱 패널·모바일 시트 두 곳에 마운트되면서
  // 중복 실행되던 것을 PostDetail(1곳)로 승격했다(#85 리뷰). 여기서는 렌더만 담당한다.
  return (
    <div className={className}>
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
                // 네이티브 즉시 점프를 막고 부모의 부드러운 스크롤을 직접 호출한다.
                // state를 경유하지 않으므로 같은 항목을 다시 눌러도 매번 스크롤된다.
                e.preventDefault();
                onFragIdChanged({ fragId: item.id });
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
