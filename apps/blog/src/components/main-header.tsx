import { PageLinkMap } from '@libs/page-link-map';
import classNames from 'classnames';
import Link from 'next/link';
import { DropdownMenu } from './dropdown-menu';
import { SeriesModel, TagModel } from '@libs/types/commons';
import { MobileSidebar } from './mobile-sidebar';
import { SearchButton } from './search';

export interface MainHeaderProps {
  seriesList: SeriesModel[];
  tags: TagModel[];
}

export function MainHeader({ seriesList, tags }: MainHeaderProps) {
  return (
    <header
      className={classNames(
        'blog-main-header',
        'relative z-50',
        'bg-ink text-white',
        'h-[60px] md:h-[128px]',
      )}
    >
      <div className="flex items-center max-w-[1080px] h-full mx-auto px-5 md:px-10">
        <MainHeaderLogo />

        <span className="grow"></span>

        {/* === SEARCH BUTTON (모든 화면 크기에서 노출) === */}
        <SearchButton className="mr-5 text-white" />

        {/* === HEADER >= MD: RIGHT SECTION === */}
        <nav className="gap-5 hidden md:flex">
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
          {/* === TAGS INDEX LINK ===
              태그가 49개로 많아 드롭다운 대신 전체 태그 인덱스 페이지로 가는 링크를 노출한다. */}
          <Link href={PageLinkMap.tags.index()} className="flex items-center">
            Tags
          </Link>
        </nav>

        {/* === HEADER < MD: RIGHT SECTION === */}
        <MobileSidebar seriesList={seriesList} tags={tags} />
      </div>
    </header>
  );
}

export function MainHeaderLogo() {
  return (
    // 다크 헤더 위에서 키보드 포커스가 보이도록 밝은 outline + offset을 부여한다.
    <Link
      href={PageLinkMap.main.landing()}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
    >
      {/* 로고는 페이지 제목이 아니므로 h1 대신 span으로 강등한다. 페이지 고유 제목만 h1로 남긴다. */}
      <span className="block text-[16px] md:text-[40px]">Malloc72p.Tech</span>
    </Link>
  );
}
