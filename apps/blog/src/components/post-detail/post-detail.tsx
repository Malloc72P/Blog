'use client';

import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostJsonLd } from '@components/post-json-ld';
import { Constants } from '@libs/constants';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import classNames from 'classnames';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import classes from './post-detail.module.scss';
import { MobileToc } from './mobile-toc';
import { Toc, TocItem } from './toc';
import { PostNavigator, PostNavigatorPlaceholder } from './post-navigator';
import { PostRecommendation } from './post-recommendation';
import { ShareButtons } from './share-buttons';
import { GiscusComments } from './giscus-comments';

export interface PostDetailProps extends PropsWithChildren {
  series: SeriesModel;
  tags: TagModel[];
  post: PostModel;
}

/**
 * 헤딩 텍스트를 앵커로 사용할 수 있는 slug로 변환한다.
 * 한글/영문/숫자/하이픈만 남기고 공백은 하이픈으로 치환해 getElementById로 찾을 수 있게 한다.
 */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/[^\w가-힣-]/g, ''); // 단어/한글/하이픈 외 문자 제거
}

/**
 * 블로그 상세 페이지.
 *
 * mdx-components에서 해당 컴포넌트를 사용해서 블로그 상세 페이지를 랜더링한다.
 */
export function PostDetail({ children, series, post }: PostDetailProps) {
  const [activeTocId, setActiveTocId] = useState('');
  // 본문 DOM에서 헤딩을 수집해 만든 목차 데이터. 빌드 타임이 아닌 마운트 후 클라이언트에서 채운다.
  const [toc, setToc] = useState<TocItem[]>([]);
  // 렌더된 MDX 본문 엘리먼트 참조. 여기서 h2/h3를 수집한다.
  const articleRef = useRef<HTMLElement>(null);

  // 본문이 렌더된 뒤 h2/h3를 수집하고, id가 없으면 텍스트 기반 slug를 부여해 목차를 구성한다.
  useEffect(() => {
    const article = articleRef.current;

    if (!article) {
      return;
    }

    // h2/h3만 목차 대상으로 삼는다(h1은 헤더에서 별도 렌더하므로 제외).
    const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'));
    const usedIds = new Set<string>();
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent?.trim() ?? '';

      if (!text) {
        return;
      }

      // 기존 id가 있으면 그대로 쓰고, 없으면 slug를 만들어 부여한다.
      let id = heading.id || slugify(text);

      // 같은 제목이 여러 번 나오면 id가 충돌하므로 접미사를 붙여 유일하게 만든다.
      if (usedIds.has(id) || !id) {
        let suffix = 1;
        const base = id || 'section';
        while (usedIds.has(`${base}-${suffix}`)) {
          suffix += 1;
        }
        id = `${base}-${suffix}`;
      }

      usedIds.add(id);
      heading.id = id; // 앵커/스크롤 이동 대상이 되도록 실제 DOM에 id를 부여한다.

      items.push({
        id,
        value: text,
        level: heading.tagName === 'H3' ? 3 : 2,
      });
    });

    setToc(items);
  }, [children]);

  // 진입 시 URL 해시가 있으면 해당 섹션으로 1회 스크롤한다(딥링크).
  // 원래 Toc 내부 effect였지만 Toc가 데스크톱 패널·모바일 시트 두 곳에 마운트되면서
  // 중복 실행되어, 헤딩 id 부여가 끝나는 이곳(위 effect 다음, 같은 커밋)으로 승격했다(#85 리뷰).
  useEffect(() => {
    // getElementById와 형식을 맞추기 위해 '#'를 제거한 값을 넘긴다.
    const hash = window.location.hash.slice(1);
    if (hash) {
      scrollToHeading({ fragId: hash });
    }
  }, []);

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
    // toc가 채워진 뒤 핸들러가 최신 목차를 참조하도록 의존성에 toc를 둔다.
  }, [toc]);

  // 목차 항목 클릭 시 해당 헤딩으로 스크롤한다. 데스크톱 ToC와 모바일 바텀시트 ToC가 공유한다(#85).
  const scrollToHeading = ({ fragId }: { fragId: string }) => {
    const targetEl = document.getElementById(fragId);

    if (!targetEl) {
      return;
    }

    // 동작 줄이기(prefers-reduced-motion) 설정 시 부드러운 스크롤 대신 즉시 이동한다.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <ArticleContainer
      jsonLd={<PostJsonLd post={post} series={series} />}
      right={
        /* TOC 패널은 폭이 고정(w-[240px])이라 거터가 충분히 넓은 xl(1280px) 이상에서만 노출한다.
           lg(1024px)에서는 거터가 좁아 패널이 뷰포트를 넘겨 가로 스크롤을 유발하므로 제외한다. */
        <div className="post-detail-toc-container justify-center sticky top-0 left-0 hidden xl:flex">
          <Toc toc={toc} activeId={activeTocId} onFragIdChanged={scrollToHeading} />
        </div>
      }
    >
      <section>
        {/* ------------------------------------------------------ */}
        {/* MOBILE TOC (xl 미만 전용: 플로팅 버튼 + 바텀시트) */}
        {/* ------------------------------------------------------ */}
        {/* 데스크톱 ToC 패널(right)이 hidden xl:flex라 1280px 미만에서 사라지므로 대체 UI를 둔다(#85). */}
        <MobileToc toc={toc} activeId={activeTocId} onFragIdChanged={scrollToHeading} />

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
          ref={articleRef}
          className={classNames('post-detail-body py-[60px] md:py-[100px]', classes.postDetail)}
        >
          {children}
        </article>

        {/* ------------------------------------------------------ */}
        {/* POST DETAIL Footer */}
        {/* ------------------------------------------------------ */}
        <footer className="post-detail-footer pb-15 md:pb-25 w-full">
          {/* 글 공유: 정식 절대 URL을 넘겨 localhost가 아닌 canonical 링크가 공유되게 한다. */}
          <ShareButtons url={`${Constants.siteConfig.url}${post.route}`} title={post.title} />

          <div className="mt-10 flex gap-10 flex-col md:flex-row">
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

          <PostRecommendation currentPost={post} />

          {/* === 댓글 (giscus · GitHub Discussions 기반, DB 없음) === */}
          <div className="mt-16 md:mt-24">
            <GiscusComments />
          </div>
        </footer>
      </section>
    </ArticleContainer>
  );
}
