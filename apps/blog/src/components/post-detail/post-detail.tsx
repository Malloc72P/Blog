'use client';

import { PropsWithChildren, ReactNode } from 'react';
import classes from './post-detail.module.scss';
import { Heading, NextraMetadata } from 'nextra';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { DateFormat, DateUtil } from '@libs/date-util';
import { TagBadge } from '@components/tag-badge';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Divider } from '@components/divider';
import classNames from 'classnames';
import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Toc } from './toc';

export interface PostDetailProps extends PropsWithChildren {
  toc: Heading[];
  series: SeriesModel;
  tags: TagModel[];
  post: PostModel;
  bottomContent: ReactNode;
}

export function PostDetail({ children, series, post, tags, bottomContent, toc }: PostDetailProps) {
  return (
    <ArticleContainer
      right={
        <div className="post-detail-toc-container flex justify-center sticky top-0 left-0">
          <Toc toc={toc} />
        </div>
      }
    >
      <section>
        {/* ------------------------------------------------------ */}
        {/* POST DETAIL BODY */}
        {/* ------------------------------------------------------ */}

        {/* ------------------------------------------------------ */}
        {/* POST DETAIL HEADER */}
        {/* ------------------------------------------------------ */}
        <ArticleHeader
          subTitle={series.title}
          title={post.title}
          date={post.date}
          tags={post.tags}
        />

        <Divider />

        {/* ------------------------------------------------------ */}
        {/* POST DETAIL BODY */}
        {/* ------------------------------------------------------ */}
        <article
          className={classNames('post-detail-body py-[30px] md:py-[65px]', classes.postDetail)}
        >
          {children}
        </article>

        {/* ------------------------------------------------------ */}
        {/* POST DETAIL BODY */}
        {/* ------------------------------------------------------ */}
        <footer className="post-detail-footer">{bottomContent}</footer>
      </section>
    </ArticleContainer>
  );
}
