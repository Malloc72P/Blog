'use client';

import { PageLinkMap } from '@libs/page-link-map';
import { SeriesModel } from '@libs/types/commons';
import { IconArrowUp } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, ReactNode } from 'react';

export interface MainFooterProps {
  seriesList: SeriesModel[];
}

export function MainFooter({ seriesList }: MainFooterProps) {
  return (
    <footer
      className={classNames(
        'blog-main-footer ',
        // 'sticky left-0 bottom-0',
        'w-full px-8 2xl:px-5 pt-8 pb-8 md:pb-16',
        'bg-gray-100',
      )}
    >
      {/* === MAIN FOOTER CONTAINER === */}
      <div className="max-w-[1080px] mx-auto min-h-full flex flex-col">
        <div className="flex grow flex-col md:flex-row">
          {/* === MAIN FOOTER LEFT SECTION === */}
          <div className="blog-main-footer-left-section grow flex flex-col min-h-full">
            {/* === MAIN FOOTER LEFT SECTION TOP BUTTON === */}
            <LinkButton
              color="primary"
              leftIcon={IconArrowUp}
              onClick={() => {
                // 동작 줄이기 설정 시 즉시 이동한다(JS 스크롤은 CSS scroll-behavior의 영향을 받지 않으므로 별도 분기).
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
            >
              <span>Back to top</span>
            </LinkButton>
          </div>

          {/* === MAIN FOOTER RIGHT SECTION SERIES LIST === */}
          <FooterList
            label="SERIES"
            items={seriesList.map((series) => ({
              id: series.id,
              label: series.title,
              href: PageLinkMap.series.landing(series.id),
            }))}
          />

          {/* === MAIN FOOTER RIGHT SECTION SITE MAP === */}
          <FooterList
            label="ONLINE"
            items={[
              { id: 'github', label: 'Github', href: 'https://github.com/Malloc72P' },
              //   { id: 'aboutme', label: 'About Malloc72P', href: '#' },
            ]}
          />
        </div>
        <div>
          <div className="text-gray-600 pt-5">
            <div>Malloc72P©</div>
            <div className="text-2xl font-bold md:text-[40px] pt-1">SeungChul Na.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterListItemModel {
  id: string;
  label: ReactNode;
  onClick?: () => void;
  href?: string;
}

interface FooterListProps {
  label: ReactNode;
  items: FooterListItemModel[];
}

function FooterList({ label, items }: FooterListProps) {
  // 현재 경로를 읽어 SERIES 목록에서 활성 항목을 강조한다.
  const pathname = usePathname();

  return (
    <div className="md:w-[200px] md:ml-10 mt-10 md:mt-0 mb-10">
      {/* === MAIN FOOTER LIST === */}
      <p className="text-gray-600 font-bold">{label}</p>
      {/* === MAIN FOOTER LIST ITEM === */}
      <ul className="mt-5">
        {items.map((item) => (
          <li key={item.id}>
            {/* href가 현재 경로와 정확히 일치하면 활성 항목으로 표시한다. */}
            <LinkButton href={item.href} color="primary" active={item.href === pathname}>
              {item.label}
            </LinkButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LinkButtonProps extends PropsWithChildren {
  href?: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
  leftIcon?: React.ElementType;
  // 현재 보고 있는 시리즈 항목인지 여부(활성 강조 및 aria-current 처리에 사용).
  active?: boolean;
}

function LinkButton({
  href,
  onClick,
  leftIcon: Icon,
  children,
  color = 'secondary',
  active = false,
}: LinkButtonProps) {
  return (
    <Link
      href={href ?? '#'}
      // 활성 항목은 스크린리더가 현재 위치를 인지하도록 aria-current를 부여한다.
      aria-current={active ? 'page' : undefined}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();

              onClick();
            }
          : undefined
      }
    >
      <div
        className={classNames(
          'transition-all duration-200 ease-in-out',
          'flex items-center gap-1 cursor-pointer',
          color === 'primary'
            ? 'text-gray-600 hover:text-gray-900'
            : 'text-gray-600 hover:text-gray-700',
          // 활성 항목은 굵게 + 진한 색 + 밑줄로 강조한다.
          active && 'font-bold text-gray-900 underline',
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">{children}</div>
      </div>
    </Link>
  );
}
