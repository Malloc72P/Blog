'use client';

import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import classNames from 'classnames';
import { Heading } from 'nextra';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import classes from './post-detail.module.scss';
import { Toc } from './toc';

export interface PostDetailProps extends PropsWithChildren {
  toc: Heading[];
  series: SeriesModel;
  tags: TagModel[];
  post: PostModel;
  bottomContent: ReactNode;
}

/**
 * 블로그 상세 페이지.
 *
 * mdx-components에서 해당 컴포넌트를 사용해서 블로그 상세 페이지를 랜더링한다.
 */
export function PostDetail({ children, series, post, bottomContent, toc }: PostDetailProps) {
  const [activeTocId, setActiveTocId] = useState('');

  useEffect(() => {
    const container = document.querySelector('.blog-main-layout');

    if (!container) {
      return;
    }

    const scrollHandler = () => {
      const currentScroll = container.scrollTop;

      const tocScrolls = toc
        .map((item) => document.getElementById(item.id))
        .filter((v) => v)
        .map((el) => {
          if (!el) {
            return null;
          }

          return {
            el,
            y: el.offsetTop,
          };
        });

      let min = 0;
      let max = Infinity;

      for (let i = 0; i < tocScrolls.length; i++) {
        const item = tocScrolls[i];
        const nextItem = tocScrolls[i + 1];

        if (!item) {
          continue;
        }

        min = i === 0 ? 0 : item.y;
        max = nextItem ? nextItem.y : Infinity;

        if (min <= currentScroll && currentScroll < max) {
          setActiveTocId(item.el.id);
          break;
        }
      }
    };

    scrollHandler();
    container.addEventListener('scroll', scrollHandler);

    return () => {
      container.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <ArticleContainer
      right={
        <div className="post-detail-toc-container justify-center sticky top-0 left-0 hidden 2xl:flex">
          <Toc
            toc={toc}
            activeId={activeTocId}
            onFragIdChanged={({ fragId }) => {
              const targetEl = document.getElementById(fragId);

              if (!targetEl) {
                return;
              }

              targetEl.scrollIntoView({ behavior: 'smooth' });
            }}
          />
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
