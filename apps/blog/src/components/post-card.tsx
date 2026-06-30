'use client';

import { PostModel, SeriesModel } from '@libs/types/commons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SeriesBadge } from './series-badge';
import { TagBadge } from './tag-badge';
import { DateUtil } from '@libs/date-util';

export interface PostCardProps {
  post: PostModel;
  series: SeriesModel;
  // 혼합 목록(최신글/태그/랜딩)에서만 시리즈 배지를 노출한다. 단일 시리즈 페이지에선 false.
  showSeriesBadge?: boolean;
}

/**
 * 랜딩페이지의 포스트 목록보기에서 사용하는 포스트 카드 컴포넌트
 */
export function PostCard({ post, showSeriesBadge = true }: PostCardProps) {
  const router = useRouter();

  // 카드 전체를 클릭하면 포스트로 이동시켜 클릭 영역을 넓힌다(제목 Link는 접근성용으로 유지).
  const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 카드 내부의 배지/링크(<a>)를 클릭한 경우엔 해당 링크가 처리하도록 카드 이동을 막는다.
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }

    router.push(post.route);
  };

  return (
    <div
      key={post.route}
      onClick={onCardClick}
      // hover 시 배경/보더/포인터로 카드 전체가 클릭 가능함을 시각적으로 알린다.
      className="px-3 py-3 mb-[30px] rounded-lg border border-transparent cursor-pointer transition-all duration-200 hover:bg-surface-muted hover:border-border"
    >
      {/* === POST TITLE AND LINK === */}
      {/* 제목 Link는 키보드 포커스/새 탭 열기 등 접근성을 위해 실제 <a>로 유지한다. */}
      <Link href={post.route}>
        {/* 목록의 각 글 제목은 문서 구조상 h2다(스크린리더 헤딩 탐색·SEO 위계).
            모바일 제목을 키워 태그(배지)와 위계를 확보한다. */}
        <h2 className="text-sm md:text-lg font-bold">{post.title}</h2>
      </Link>

      {/* 목록에서는 분/시 없이 날짜만 노출한다(date-format의 postCard 패턴 사용). */}
      <div className="text-gray-600 text-xs md:text-[16px] mt-1 sm:mt-2">
        {DateUtil.format(post.date, 'postCard')}
      </div>

      {/* === POST SERIES & TAG CONTAINER === */}
      <div className="mt-3 flex flex-wrap gap-3">
        {/* === POST SERIES ===
            혼합 목록에서만, 각 포스트의 실제 시리즈를 배지로 노출한다. */}
        {showSeriesBadge && (
          <SeriesBadge seriesId={post.series.id} title={post.series.title} />
        )}

        {/* === POST TAGS === */}
        {post.tags.map((tag) => (
          <TagBadge key={tag.id} tagId={tag.id} />
        ))}
      </div>
    </div>
  );
}
