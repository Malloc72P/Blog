import { SeriesModel } from '@libs/types/commons';
import { IconArrowUp } from '@tabler/icons-react';
import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, ReactNode, useMemo } from 'react';

export interface MainFooterProps {
  seriesList: SeriesModel[];
}

export function MainFooter({ seriesList }: MainFooterProps) {
  return (
    <footer className="blog-main-footer h-[410px] sticky left-0 bottom-0 px-5 py-8 bg-gray-100">
      {/* === MAIN FOOTER CONTAINER === */}
      <div className="max-w-[1400px] mx-auto flex min-h-full">
        {/* === MAIN FOOTER LEFT SECTION === */}
        <div className={classNames('blog-main-footer-left-section grow flex flex-col min-h-full')}>
          {/* === MAIN FOOTER LEFT SECTION TOP BUTTON === */}
          <LinkButton color="primary" leftIcon={IconArrowUp}>
            <span>Back to top</span>
          </LinkButton>

          <span className="grow"></span>

          <div className="text-gray-400">
            <div>Malloc72P©</div>
            <div className="text-[40px]">SeungChul Na.</div>
          </div>
        </div>

        {/* === MAIN FOOTER RIGHT SECTION SERIES LIST === */}
        <FooterList
          label="SERIES"
          items={seriesList.map((series) => ({ id: series.id, label: series.title }))}
        />

        {/* === MAIN FOOTER RIGHT SECTION SITE MAP === */}
        <FooterList
          label="ONLINE"
          items={[
            { id: 'github', label: 'Github' },
            { id: 'aboutme', label: 'About Malloc72P' },
          ]}
        />
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
    <div className="w-[200px] ">
      {/* === MAIN FOOTER LIST === */}
      <h4 className="text-gray-400 font-bold">{label}</h4>
      {/* === MAIN FOOTER LIST ITEM === */}
      <ul className="mt-5">
        {items.map((item) => (
          <li key={item.id}>
            <LinkButton color="primary">{item.label}</LinkButton>
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
  );
}
