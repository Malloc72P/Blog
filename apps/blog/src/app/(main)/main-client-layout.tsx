'use client';

import { MainFooter } from '@components/main-footer';
import { MainHeader } from '@components/main-header';
import { SeriesModel, TagModel } from '@libs/types/commons';
import { createContext, PropsWithChildren, useMemo } from 'react';

export interface MainClientLayoutProps extends PropsWithChildren {
  tags: TagModel[];
  seriesList: SeriesModel[];
}

export interface MainLayoutContextType {
  tags: TagModel[];
  seriesList: SeriesModel[];
}

export const MainLayoutContext = createContext<MainLayoutContextType>({
  seriesList: [],
  tags: [],
});

export default function MainClientLayout({ tags, seriesList, children }: MainClientLayoutProps) {
  const contextState = useMemo<MainLayoutContextType>(
    () => ({
      tags,
      seriesList,
    }),
    []
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
