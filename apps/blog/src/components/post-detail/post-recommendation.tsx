'use client';

import { MainLayoutContext } from 'src/app/(main)/main-client-layout';
import { recommendPosts } from '@libs/recommend-posts';
import { PostModel } from '@libs/types/commons';
import Link from 'next/link';
import { useContext, useMemo } from 'react';

export interface PostRecommendationProps {
  // 현재 보고 있는 글. 이 글과의 유사도로 추천 목록을 만든다.
  currentPost: PostModel;
}

export function PostRecommendation({ currentPost }: PostRecommendationProps) {
  // 전체 글 목록은 레이아웃 컨텍스트에 이미 있어 추가 fetch가 필요 없다.
  const { posts } = useContext(MainLayoutContext);

  // 태그 겹침 + 같은 시리즈 가중치로 상위 4개를 산출한다(현재 글 제외).
  const recommendedPosts = useMemo(
    () => recommendPosts(currentPost, posts, 4),
    [currentPost, posts],
  );

  // 접점 있는 글이 하나도 없으면 섹션 자체를 숨긴다.
  if (recommendedPosts.length === 0) {
    return null;
  }

  return (
    <div className="post-recommendation mt-10">
      <span className="text-sm text-gray-500 font-medium">함께 읽으면 좋은 글</span>
      <div className="flex flex-row gap-3 overflow-x-auto mt-3 pb-1">
        {recommendedPosts.map((post) => (
          <Link
            key={post.id}
            href={post.route}
            className="group/rec-card shrink-0 flex flex-col gap-2 bg-surface-muted p-4 rounded-md w-55 cursor-pointer"
          >
            <span className="text-xs text-gray-400">{post.series.title}</span>
            <span className="text-sm font-bold leading-snug group-hover/rec-card:underline line-clamp-3">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
