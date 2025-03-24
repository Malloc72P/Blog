import { TagBadge } from '@components/tag-badge';
import { DateUtil } from '@libs/date-util';
import { TagModel } from '@libs/types/commons';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

export interface ArticleHeaderProps {
  subTitle: string;
  title: string;
  date?: Date;
  tags?: TagModel[];
}

export function ArticleHeader({ subTitle, title, date, tags }: ArticleHeaderProps) {
  return (
    <header className="post-detail-header pt-[98px] pb-[42px] flex flex-col items-center">
      {/* === ARTICLE TITLE === */}
      <h4 className="flex items-center gap-1 text-gray-400">
        <IconChevronsLeft className="w-4 h-4" />
        {subTitle}
        <IconChevronsRight className="w-4 h-4" />
      </h4>

      {/* === ARTICLE TITLE === */}
      <h1 className="py-[40px] text-[40px] leading-[63px] font-bold ">{title}</h1>

      {/* === DATE === */}
      {date && <p className="text-gray-400 leading-[24px]">{DateUtil.format(date, 'long')}</p>}

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
