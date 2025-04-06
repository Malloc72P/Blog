import { TagBadge } from '@components/tag-badge';
import { DateUtil } from '@libs/date-util';
import { TagModel } from '@libs/types/commons';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import classNames from 'classnames';

export interface ArticleHeaderProps {
  subTitle: string;
  title: string;
  date?: Date;
  tags?: TagModel[];
}

export function ArticleHeader({ subTitle, title, date, tags }: ArticleHeaderProps) {
  return (
    <header
      className={classNames(
        'post-detail-header flex flex-col items-center',
        'pt-[40px] pb-[30px] md:pt-[98px] md:pb-[42px]'
      )}
    >
      {/* === ARTICLE TITLE === */}
      <h4
        className={classNames(
          'article-header-title flex items-center gap-1 text-gray-400',
          'text-xs md:text-[16px]'
        )}
      >
        <IconChevronsLeft className="w-4 h-4" />
        {subTitle}
        <IconChevronsRight className="w-4 h-4" />
      </h4>

      {/* === ARTICLE TITLE === */}
      <h1
        className={classNames(
          'py-[20px] text-[20px] ',
          'md:py-[40px] md:text-[30px]',
          'lg:text-[40px]',
          'leading-[32px] md:leading-[64px] font-bold'
        )}
      >
        {title}
      </h1>

      {/* === DATE === */}
      {date && (
        <p className={classNames('text-gray-400 leading-[24px]', 'text-xs md:text-[16px]')}>
          {DateUtil.format(date, 'long')}
        </p>
      )}

      {/* === TAGS === */}
      {tags && (
        <div className="py-[28px] flex gap-5">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tagId={tag.id} />
          ))}
        </div>
      )}
    </header>
  );
}
