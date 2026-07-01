'use client';

import classNames from 'classnames';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearch } from './search-context';
import { useModalA11y } from '@hooks/use-modal-a11y';

export function SearchModal() {
  const { isOpen, close, status, search } = useSearch();
  const router = useRouter();
  const [query, setQuery] = useState(''); // 입력 질의
  const [activeIndex, setActiveIndex] = useState(0); // 키보드 활성 항목
  const inputRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null); // 현재 활성 결과 항목

  // 배경(body) 스크롤 잠금 + 배경 콘텐츠 inert 격리를 공용 훅으로 일원화한다(#106).
  // dialogRef는 document.body에 포털로 렌더되는 최상위(오버레이) 요소를 가리키며
  // Tab 포커스 트랩의 스캔 범위로도 재사용한다.
  const { mounted, dialogRef: containerRef } = useModalA11y(isOpen);

  // 질의가 바뀔 때마다 결과 재계산(status는 콜백에서 참조하지 않아 의존성에서 제외)
  const results = useMemo(() => search(query), [search, query]);

  // 모달이 열리면 입력 초기화 + 포커스
  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    // 렌더 직후 다음 프레임에 포커스
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  // 질의가 바뀌면 활성 인덱스 초기화
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // 키보드로 이동한 활성 항목이 항상 보이도록 스크롤
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // isOpen이 true가 될 수 있는 시점은 항상 하이드레이션 이후(사용자 클릭)이므로
  // !mounted는 사실상 도달하지 않지만, portal 사용 시 SSR 안전을 위해 명시적으로 가드한다.
  if (!isOpen || !mounted) return null;

  const keyword = query.trim();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    // Tab 포커스를 모달 내부로 가둔다(포커스 트랩)
    if (e.key === 'Tab') {
      const container = containerRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus(); // 처음에서 Shift+Tab → 마지막으로 순환
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus(); // 마지막에서 Tab → 처음으로 순환
      }
      return;
    }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length); // 다음 항목
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length); // 이전 항목
    } else if (e.key === 'Enter') {
      const target = results[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(target.route); // 클라이언트 라우팅으로 이동
        close();
      }
    }
  };

  return createPortal(
    // document.body에 직접 포털로 렌더한다. 그래야 useModalA11y가 이 오버레이를 제외한
    // body의 다른 모든 자식(헤더·본문 등)에 inert를 적용해 배경을 완전히 격리할 수 있다(#106).
    // 배경 오버레이(클릭 시 닫힘)이자 dialogRef가 가리키는 포털 최상위 요소.
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/50 px-4 pt-[12vh]"
      onClick={close}
    >
      {/* 모달 본체(내부 클릭은 닫힘 전파 차단) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="포스트 검색"
        className="w-full max-w-[640px] overflow-hidden rounded-xl bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {/* 검색 입력 영역 */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <IconSearch className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="포스트 검색…"
            aria-label="포스트 검색"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-result-list"
            aria-activedescendant={results.length > 0 ? `search-option-${activeIndex}` : undefined}
            className="h-14 w-full bg-transparent text-base text-black outline-none placeholder:text-gray-400"
          />
          <button
            onClick={close}
            aria-label="검색 닫기"
            className="shrink-0 text-gray-400 hover:text-black"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* 결과 영역 */}
        <div className="max-h-[60vh] overflow-y-auto">
          {status === 'loading' && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              검색 인덱스를 불러오는 중…
            </p>
          )}
          {status === 'error' && (
            <p className="px-4 py-6 text-center text-sm text-red-500">
              검색 인덱스를 불러오지 못했습니다.
            </p>
          )}
          {status === 'ready' && keyword.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              제목, 내용, 태그로 포스트를 검색하세요.
            </p>
          )}
          {status === 'ready' && keyword.length > 0 && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">검색 결과가 없습니다.</p>
          )}

          <ul id="search-result-list" role="listbox">
            {results.map((doc, idx) => (
              <li
                key={doc.route}
                id={`search-option-${idx}`}
                role="option"
                aria-selected={idx === activeIndex}
                ref={idx === activeIndex ? activeItemRef : null}
              >
                <Link
                  href={doc.route}
                  onClick={close}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={classNames(
                    'block border-b border-border-subtle px-4 py-3',
                    idx === activeIndex ? 'bg-gray-100' : 'bg-surface',
                  )}
                >
                  <div className="flex items-center gap-2">
                    {doc.series && (
                      <span className="shrink-0 rounded bg-ink px-1.5 py-0.5 text-[11px] text-white">
                        {doc.series}
                      </span>
                    )}
                    <span className="font-medium text-black">{doc.title}</span>
                  </div>
                  {doc.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">{doc.description}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
