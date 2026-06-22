'use client';

import { useState } from 'react';
import { MainHeaderLogo, MainHeaderProps } from './main-header';
import { IconMenu2, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageLinkMap } from '@libs/page-link-map';
import { Divider } from './divider';

// MainHeaderProps와 동일한 props를 받으므로 빈 인터페이스 대신 타입 별칭으로 둔다.
export type MobileSidebarProps = MainHeaderProps;

export function MobileSidebar({ seriesList, tags }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const onLinkClick = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* ------------------------------------------------------ */}
      {/* SIDEBAR TRIGGER */}
      {/* ------------------------------------------------------ */}
      {/* 탭 영역 확대를 위해 래퍼에 패딩(p-2.5)을 주고 onClick을 래퍼로 올린다(아이콘 크기는 유지). */}
      <div className="flex md:hidden cursor-pointer p-2.5" onClick={() => setOpen(true)}>
        <IconMenu2 className="w-5 h-5" />
      </div>

      {/* ------------------------------------------------------ */}
      {/* SIDEBAR BODY */}
      {/* ------------------------------------------------------ */}
      <div
        className={classNames(
          'h-[100vh] w-full bg-white z-50 fixed top-0 right-0',
          'transition-all duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ------------------------------------------------------ */}
        {/* SIDEBAR HEADER */}
        {/* ------------------------------------------------------ */}
        <div className="flex items-center px-5 h-[60px] bg-black">
          <MainHeaderLogo />
          <span className="grow"></span>

          {/* ------------------------------------------------------ */}
          {/* SIDEBAR CLOSE BUTTON */}
          {/* ------------------------------------------------------ */}
          {/* 탭 영역 확대를 위해 닫기 버튼 래퍼에 패딩(p-2.5)을 더한다(아이콘 크기는 유지). */}
          <div className="flex items-center cursor-pointer p-2.5" onClick={() => setOpen(false)}>
            <IconX className="w-5 h-5 " />
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SIDEBAR CONTENT */}
        {/* ------------------------------------------------------ */}
        <div className="pt-10 text-black px-5 space-y-10">
          <SidebarSection
            onClick={onLinkClick}
            title="Series"
            items={seriesList.map((series) => ({
              id: series.id,
              label: series.title,
              href: PageLinkMap.series.landing(series.id),
            }))}
          />

          <SidebarSection
            onClick={onLinkClick}
            title="Tags"
            items={tags.map((tag) => ({
              id: tag.id,
              label: tag.id,
              href: PageLinkMap.tags.landing(tag.id),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

interface SidebarSectionProps {
  title: string;
  items: {
    id: string;
    label: string;
    href: string;
  }[];
  onClick: () => void;
}

function SidebarSection({ title, items, onClick }: SidebarSectionProps) {
  // 현재 경로를 읽어 Series 목록에서 활성 항목을 강조한다.
  const pathname = usePathname();

  return (
    <div className="sidebar-section">
      <div className="pb-3 text-lg">
        <p className="pb-1">{title}</p>
        <Divider color="bg-gray-500" />
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          // href가 현재 경로와 정확히 일치하면 활성 항목으로 표시한다.
          const active = item.href === pathname;

          return (
            <li key={item.id} onClick={onClick}>
              <Link
                href={item.href}
                // 활성 항목은 스크린리더가 현재 위치를 인지하도록 aria-current를 부여한다.
                aria-current={active ? 'page' : undefined}
                // 활성 항목은 굵게 + 밑줄로 강조한다.
                className={classNames(active && 'font-bold underline')}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
