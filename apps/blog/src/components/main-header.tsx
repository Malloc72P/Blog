import { PageLinkMap } from '@libs/page-link-map';
import classNames from 'classnames';
import Link from 'next/link';
import { MenuIcon } from 'nextra/icons';
import { DropdownMenu } from './dropdown-menu';
import { SeriesModel, TagModel } from '@libs/types/commons';
import { MobileSidebar } from './mobile-sidebar';

export interface MainHeaderProps {
  seriesList: SeriesModel[];
  tags: TagModel[];
}

export function MainHeader({ seriesList, tags }: MainHeaderProps) {
  return (
    <header className="blog-main-header bg-black text-white h-[60px] md:h-[128px] z-10">
      <div className="flex items-center max-w-[1080px] h-full mx-auto px-5 md:px-10">
        <MainHeaderLogo />

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
          {/* === TAGS DROPDOWN MENU === */}
          <DropdownMenu
            title="Tags"
            width={160}
            // leftOffset={-25}
            items={tags.map((tag) => ({
              id: tag.id,
              label: tag.id,
              href: PageLinkMap.tags.landing(tag.id),
            }))}
          />
        </div>

        {/* === HEADER < MD: RIGHT SECTION === */}
        <MobileSidebar seriesList={seriesList} tags={tags} />
      </div>
    </header>
  );
}

export function MainHeaderLogo() {
  return (
    <Link href={PageLinkMap.main.landing()}>
      <h1 className="text-[16px] md:text-[40px]">Malloc72p.Tech</h1>
    </Link>
  );
}
