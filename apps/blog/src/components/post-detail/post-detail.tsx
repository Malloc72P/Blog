import { PropsWithChildren, ReactNode } from 'react';
import classes from './post-detail.module.scss';
import { Heading, NextraMetadata } from 'nextra';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { DateFormat, DateUtil } from '@libs/date-util';
import { TagBadge } from '@components/tag-badge';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Divider } from '@components/divider';

export interface PostDetailProps extends PropsWithChildren {
  toc: Heading[];
  series: SeriesModel;
  tags: TagModel[];
  post: PostModel;
  bottomContent: ReactNode;
}

export function PostDetail({ children, series, post, tags, bottomContent, toc }: PostDetailProps) {
  return (
    <section className={classes.postDetail}>
      {/* ------------------------------------------------------ */}
      {/* POST DETAIL HEADER */}
      {/* ------------------------------------------------------ */}
      <header className="post-detail-header pt-[98px] pb-[42px] flex flex-col items-center">
        {/* === SERIES TITLE === */}
        <h4 className="flex items-center gap-1 text-gray-400">
          <IconChevronsLeft className="w-4 h-4" />
          {series.title}
          <IconChevronsRight className="w-4 h-4" />
        </h4>

        {/* === POST TITLE === */}
        <h1 className="py-[40px] text-[40px] leading-[63px] font-bold ">{post.title}</h1>

        {/* === DATE === */}
        <p className="text-gray-400 leading-[24px]">{DateUtil.format(post.date, 'long')}</p>

        {/* === TAGS === */}
        <div className="py-[28px] flex gap-5">
          {tags.map((tag) => (
            <TagBadge tagId={tag.id} />
          ))}
        </div>
      </header>

      <Divider />

      {/* ------------------------------------------------------ */}
      {/* POST DETAIL BODY */}
      {/* ------------------------------------------------------ */}
      <article className="post-detail-body py-[65px]"></article>

      {/* ------------------------------------------------------ */}
      {/* POST DETAIL BODY */}
      {/* ------------------------------------------------------ */}
      <footer className="post-detail-footer"></footer>
      {children}
      {bottomContent}
    </section>
  );
}
