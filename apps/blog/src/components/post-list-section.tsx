import { PostModel } from '@libs/types/commons';
import { ReactNode } from 'react';
import { PostCard } from './post-card';

export interface PostListSectionProps {
  posts: PostModel[];
  // 글이 하나도 없을 때 보여줄 내용.
  emptyState: ReactNode;
  // 혼합 목록에서 카드에 시리즈 배지를 노출할지. 생략하면 PostCard의 기본값을 따른다.
  showSeriesBadge?: boolean;
}

/**
 * 시리즈 상세와 태그 상세가 공유하는 글 목록 영역.
 *
 * 빈 상태 분기와 카드 목록 렌더를 한 곳에 모아 두 페이지의 여백·구조가 따로 놀지 않게 한다.
 * 빈 상태의 문구와 복구 동선은 페이지마다 다르므로 emptyState로 받는다.
 */
export function PostListSection({ posts, emptyState, showSeriesBadge }: PostListSectionProps) {
  if (posts.length === 0) {
    return <div className="py-[65px]">{emptyState}</div>;
  }

  return (
    <article className="py-[65px]">
      {posts.map((post) => (
        <PostCard key={post.route} post={post} showSeriesBadge={showSeriesBadge} />
      ))}
    </article>
  );
}
