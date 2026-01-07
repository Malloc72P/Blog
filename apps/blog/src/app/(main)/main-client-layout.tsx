'use client';

import { MainFooter } from '@components/main-footer';
import { MainHeader } from '@components/main-header';
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
  const contextState = useMemo<MainLayoutContextType>(
    () => ({
      tags,
      seriesList,
      posts,
    }),
    [],
  );

  return (
    <MainLayoutContext.Provider value={contextState}>
      <div className="blog-main-layout h-full">
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
    </MainLayoutContext.Provider>
  );
}
