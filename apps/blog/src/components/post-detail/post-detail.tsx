'use client';

import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import classNames from 'classnames';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import classes from './post-detail.module.scss';
import { Toc } from './toc';
import { PostNavigator, PostNavigatorPlaceholder } from './post-navigator';

export interface PostDetailProps extends PropsWithChildren {
  series: SeriesModel;
  tags: TagModel[];
  post: PostModel;
  toc?: any[];
  bottomContent?: ReactNode;
}

/**
 * 블로그 상세 페이지.
 *
 * mdx-components에서 해당 컴포넌트를 사용해서 블로그 상세 페이지를 랜더링한다.
 */
export function PostDetail({
  children,
  series,
  post,
  bottomContent = null,
  toc = [],
}: PostDetailProps) {
  const [activeTocId, setActiveTocId] = useState('');

  useEffect(() => {
    const container = window;

    if (!container) {
      return;
    }

    const scrollHandler = () => {
      const currentScroll = container.scrollY;

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
      const lastItem = tocScrolls[tocScrolls.length - 1];

      for (let i = 0; i < tocScrolls.length; i++) {
        const item = tocScrolls[i];
        const nextItem = tocScrolls[i + 1];

        if (!item) {
          continue;
        }

        // 해당 문단의 스크롤 범위를 계산
        min = i === 0 ? 0 : item.y;
        // 다음 아이템이 있으면, 그 아이템의 y 좌표 전 까지가 해당 아이템의 스크롤 범위.
        max = nextItem ? nextItem.y - 1 : Infinity;

        // 스크롤이 맨 아래에 부딫힌 경우
        if (lastItem && document.body.scrollHeight - document.body.clientHeight === currentScroll) {
          setActiveTocId(lastItem.el.id);
          break;
        }

        // 스크롤이 해당 문단의 범위 안에 있는 경우
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
          className={classNames('post-detail-body py-[60px] md:py-[100px]', classes.postDetail)}
        >
          {children}
        </article>

        {/* ------------------------------------------------------ */}
        {/* POST DETAIL Footer */}
        {/* ------------------------------------------------------ */}
        <footer className="post-detail-footer pb-[60px] md:pb-[100px] w-full">
          <div className="flex gap-10 flex-col md:flex-row">
            {post.prevPost ? (
              <PostNavigator mode="prev" post={post.prevPost} />
            ) : (
              <PostNavigatorPlaceholder />
            )}

            {post.nextPost ? (
              <PostNavigator mode="next" post={post.nextPost} />
            ) : (
              <PostNavigatorPlaceholder />
            )}
          </div>
        </footer>
      </section>
    </ArticleContainer>
  );
}
