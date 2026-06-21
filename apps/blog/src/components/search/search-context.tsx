'use client';

import Fuse, { IFuseOptions } from 'fuse.js';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SearchDoc } from '@libs/types/search';

// 최대 노출 결과 수
const MAX_RESULTS = 8;

// Fuse 검색 옵션: 제목 > 태그 > 설명 > 본문 순으로 가중치 부여
const FUSE_OPTIONS: IFuseOptions<SearchDoc> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.3 },
    { name: 'description', weight: 0.15 },
    { name: 'content', weight: 0.05 },
  ],
  includeScore: true, // 정렬을 위해 점수 포함
  ignoreLocation: true, // 매칭 위치 무관(긴 본문/한글 부분일치에 중요)
  threshold: 0.35, // 너무 느슨하지 않게 매칭 임계값 설정
  minMatchCharLength: 2, // 2글자 이상부터 매칭
};

// 인덱스 로딩 상태
type IndexStatus = 'idle' | 'loading' | 'ready' | 'error';

interface SearchContextValue {
  isOpen: boolean; // 모달 열림 여부
  open: () => void; // 모달 열기
  close: () => void; // 모달 닫기
  status: IndexStatus; // 인덱스 로딩 상태
  search: (query: string) => SearchDoc[]; // 검색 실행
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** SearchProvider 하위에서 검색 상태/동작에 접근한다 */
export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    // Provider 밖에서 사용하는 실수를 빌드 단계에서 빨리 드러내기 위함
    throw new Error('useSearch must be used within <SearchProvider>');
  }
  return ctx;
}

export function SearchProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<IndexStatus>('idle');
  // Fuse 인스턴스는 렌더링과 무관하므로 ref에 보관
  const fuseRef = useRef<Fuse<SearchDoc> | null>(null);
  // 로딩 중복 방지를 위한 플래그
  const loadingRef = useRef(false);

  // 검색 인덱스를 최초 1회만 lazy 로드한다
  const loadIndex = useCallback(async () => {
    if (fuseRef.current || loadingRef.current) return; // 이미 로드/로딩 중이면 skip
    loadingRef.current = true;
    setStatus('loading');
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) {
        throw new Error(`search index fetch failed: ${res.status}`);
      }
      const docs: SearchDoc[] = await res.json();
      fuseRef.current = new Fuse(docs, FUSE_OPTIONS);
      setStatus('ready');
    } catch {
      setStatus('error');
    } finally {
      loadingRef.current = false;
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    void loadIndex(); // 열 때 인덱스 로드 시작
  }, [loadIndex]);

  const close = useCallback(() => setIsOpen(false), []);

  const search = useCallback((query: string): SearchDoc[] => {
    const fuse = fuseRef.current;
    const keyword = query.trim();
    if (!fuse || keyword.length === 0) return []; // 인덱스 없거나 빈 질의면 결과 없음
    return fuse.search(keyword, { limit: MAX_RESULTS }).map((result) => result.item);
  }, []);

  // ⌘K / Ctrl+K 전역 단축키로 모달 토글
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) void loadIndex(); // 열릴 때 인덱스 로드
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loadIndex]);

  const value = useMemo<SearchContextValue>(
    () => ({ isOpen, open, close, status, search }),
    [isOpen, open, close, status, search],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
