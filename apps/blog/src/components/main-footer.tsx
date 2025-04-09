import { PageLinkMap } from '@libs/page-link-map';
import { SeriesModel } from '@libs/types/commons';
import { IconArrowUp } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import React, { PropsWithChildren, ReactNode } from 'react';

export interface MainFooterProps {
  seriesList: SeriesModel[];
}

export function MainFooter({ seriesList }: MainFooterProps) {
  return (
    <footer className="blog-main-footer sticky left-0 bottom-0 px-8 2xl:px-5 pt-8 pb-8 md:pb-16 bg-gray-100">
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
                const el = document.querySelector('.blog-main-layout');

                el?.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="text-gray-400 pt-5">
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
  return (
    <div className="md:w-[200px] md:ml-10 mt-10 md:mt-0 mb-10">
      {/* === MAIN FOOTER LIST === */}
      <h4 className="text-gray-400 font-bold">{label}</h4>
      {/* === MAIN FOOTER LIST ITEM === */}
      <ul className="mt-5">
        {items.map((item) => (
          <li key={item.id}>
            <LinkButton href={item.href} color="primary">
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
}

function LinkButton({
  href,
  onClick,
  leftIcon: Icon,
  children,
  color = 'secondary',
}: LinkButtonProps) {
  return (
    <Link
      href={href ?? '#'}
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
            ? 'text-gray-400 hover:text-gray-700'
            : 'text-gray-400 hover:text-gray-500'
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">{children}</div>
      </div>
    </Link>
  );
}
