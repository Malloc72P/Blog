'use client';

import { useState } from 'react';
import { MainHeaderLogo, MainHeaderProps } from './main-header';
import { IconMenu2, IconMenu3, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { PageLinkMap } from '@libs/page-link-map';
import { Divider } from './divider';

export interface MobileSidebarProps extends MainHeaderProps {}

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
      <div className="flex md:hidden cursor-pointer">
        <IconMenu2 className="w-5 h-5" onClick={() => setOpen(true)} />
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
          <div className="flex items-center cursor-pointer" onClick={() => setOpen(false)}>
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
  return (
    <div className="sidebar-section">
      <div className="pb-3 text-lg">
        <p className="pb-1">{title}</p>
        <Divider color="bg-gray-500" />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} onClick={onClick}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
