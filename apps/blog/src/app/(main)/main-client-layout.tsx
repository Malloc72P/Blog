'use client';

import { MainFooter } from '@components/main-footer';
import { MainHeader } from '@components/main-header';
import { SearchModal, SearchProvider } from '@components/search';
import { Constants } from '@libs/constants';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { createContext, PropsWithChildren, useMemo } from 'react';

export interface MainClientLayoutProps extends PropsWithChildren {
  posts: PostModel[];
  tags: TagModel[];
  seriesList: SeriesModel[];
}

export interface MainLayoutContextType {
  tags: TagModel[];
  seriesList: SeriesModel[];
  posts: PostModel[];
}

export const MainLayoutContext = createContext<MainLayoutContextType>({
  seriesList: [],
  tags: [],
  posts: [],
});

export default function MainClientLayout({
  tags,
  seriesList,
  posts,
  children,
}: MainClientLayoutProps) {
  // 랜딩 데이터(posts/seriesList/tags)는 force-static 서버 컴포넌트에서 한 번 계산되어
  // 내려오는 정적 값이므로, 마운트 시 1회만 컨텍스트를 구성하고 이후 재계산하지 않는다.
  const contextState = useMemo<MainLayoutContextType>(
    () => ({
      tags,
      seriesList,
      posts,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MainLayoutContext.Provider value={contextState}>
      {/* 검색 컨텍스트로 헤더 버튼과 모달이 상태를 공유한다 */}
      <SearchProvider>
        <div className="blog-main-layout h-full">
          {/* 키보드 사용자가 헤더 내비를 건너뛰고 본문으로 바로 이동할 수 있는 skip 링크.
              평소엔 sr-only로 숨기고 포커스되면 좌상단에 노출한다. */}
          <a
            href={`#${Constants.a11y.mainContentId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            본문으로 건너뛰기
          </a>

          {/* ------------------------------------------------------ */}
          {/* HEADER */}
          {/* ------------------------------------------------------ */}
          <MainHeader seriesList={seriesList} tags={tags} />

          {/* ------------------------------------------------------ */}
          {/* ARTICLE */}
          {/* ------------------------------------------------------ */}
          {children}

          {/* ------------------------------------------------------ */}
          {/* Footer */}
          {/* ------------------------------------------------------ */}
          <MainFooter seriesList={seriesList} />
        </div>

        {/* 검색 모달(전역) */}
        <SearchModal />
      </SearchProvider>
    </MainLayoutContext.Provider>
  );
}
