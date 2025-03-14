'use client';

import { MainFooter } from '@components/main-footer';
import { SeriesModel, TagModel } from '@libs/types/commons';
import classNames from 'classnames';
import { MenuIcon } from 'nextra/icons';
import { createContext, PropsWithChildren, useMemo, useState } from 'react';

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
        <header
          className={classNames('blog-main-header bg-black text-white', 'h-[60px] md:h-[128px]')}
        >
          <div className="flex items-center max-w-[1400px] h-full mx-auto px-5">
            <h1 className="text-[16px] md:text-[40px]">Malloc72p.Tech</h1>
            <span className="grow"></span>

            {/* === HEADER >= MD: RIGHT SECTION === */}
            <div className="gap-5 hidden md:flex">
              <div>About Me</div>
              <div>Series</div>
              <div>Topics</div>
            </div>

            {/* === HEADER < MD: RIGHT SECTION === */}
            <div className="flex md:hidden">
              <MenuIcon className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------ */}
        {/* ARTICLE */}
        {/* ------------------------------------------------------ */}
        <div className="blog-landing-main relative z-10 min-h-[100vh] bg-white">
          <div className="max-w-[1400px] mx-auto px-5">{children}</div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* Footer */}
        {/* ------------------------------------------------------ */}
        <MainFooter seriesList={seriesList} />
      </div>
    </MainLayoutContext.Provider>
  );
}
