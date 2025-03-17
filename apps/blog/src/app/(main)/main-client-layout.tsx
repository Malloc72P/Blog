'use client';

import { DropdownMenu } from '@components/dropdown-menu';
import { MainFooter } from '@components/main-footer';
import { PageLinkMap } from '@libs/page-link-map';
import { SeriesModel, TagModel } from '@libs/types/commons';
import classNames from 'classnames';
import Link from 'next/link';
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
          <div className="flex items-center max-w-[1080px] h-full mx-auto px-5">
            <Link href={PageLinkMap.main.landing()}>
              <h1 className="text-[16px] md:text-[40px]">Malloc72p.Tech</h1>
            </Link>
            <span className="grow"></span>

            {/* === HEADER >= MD: RIGHT SECTION === */}
            <div className="gap-5 hidden md:flex">
              {/* <div>About Me</div> */}

              {/* === SERIES DROPDOWN MENU === */}
              <DropdownMenu
                title="Series"
                width={200}
                items={seriesList.map((series) => ({
                  id: series.id,
                  label: series.title,
                  href: PageLinkMap.series.landing(series.id),
                }))}
              />

              {/* === TAGS(Topic) DROPDOWN MENU === */}
              <DropdownMenu
                title="Topics"
                width={100}
                items={tags.map((tag) => ({
                  id: tag.id,
                  label: tag.id,
                  href: PageLinkMap.tags.landing(tag.id),
                }))}
              />
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
          <div className="max-w-[1080px] mx-auto px-5">{children}</div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* Footer */}
        {/* ------------------------------------------------------ */}
        <MainFooter seriesList={seriesList} />
      </div>
    </MainLayoutContext.Provider>
  );
}
