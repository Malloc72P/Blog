'use client';

import { useEffect, useState } from 'react';
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

  // 사이드바가 열린 동안 배경(body) 스크롤을 잠근다.
  // 잠그지 않으면 사이드바 뒤의 본문이 함께 스크롤되어 동작이 어색해진다.
  useEffect(() => {
    // 닫혀 있을 때는 아무 것도 하지 않고, 기존 overflow 값을 건드리지 않는다.
    if (!open) return;

    // 잠그기 직전의 overflow 값을 저장해 두었다가 닫힐 때 그대로 복구한다.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // 데스크톱(md, 768px 이상) 너비로 넓어지면 모바일 사이드바를 닫는다.
  // 닫지 않으면 트리거가 숨겨진 채 패널이 남고, 위 스크롤 잠금도 해제되지 않는다.
  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

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
          // 모바일 브라우저 주소창 높이를 반영하도록 100vh 대신 100dvh를 사용한다.
          // md:hidden — 데스크톱 너비에서는 패널이 열린 채 남지 않도록 숨긴다.
          'h-[100dvh] w-full bg-white z-50 fixed top-0 right-0 md:hidden',
          // 헤더는 고정하고 콘텐츠 영역만 스크롤시키기 위해 세로 flex 컬럼으로 구성한다.
          'flex flex-col',
          // 전이는 가로 슬라이드(transform)로 한정한다. transition-all이면 dvh 높이 변화까지
          // 애니메이션되어 iOS 주소창 접힘 시 패널 높이가 늘었다 줄었다 하는 잔상이 생긴다.
          'transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ------------------------------------------------------ */}
        {/* SIDEBAR HEADER */}
        {/* ------------------------------------------------------ */}
        <div className="flex items-center px-5 h-[60px] bg-black shrink-0">
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
        {/* flex-1로 남은 높이를 모두 차지하고, 넘치는 태그 목록은 overflow-y-auto로 스크롤시킨다. */}
        {/* overscroll-contain: 끝단에서 스크롤이 배경 문서로 전파(체이닝)되거나 iOS 러버밴딩되는 것을 막는다. */}
        {/* 마지막 항목이 화면 끝에 붙지 않도록 하단 패딩(pb-10)을 둔다. */}
        <div className="flex-1 overflow-y-auto overscroll-contain pt-10 pb-10 text-black px-5 space-y-10">
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
