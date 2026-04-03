'use client';

import { Constants } from '@libs/constants';
import { MainLayoutContext } from 'src/app/(main)/main-client-layout';
import Link from 'next/link';
import { useContext, useMemo } from 'react';

export function PostRecommendation() {
  const { posts } = useContext(MainLayoutContext);

  const recommendedPosts = useMemo(() => {
    const ids = Constants.recommendation.postIds;
    return ids
      .map((id) => posts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [posts]);

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
            className="group/rec-card shrink-0 flex flex-col gap-2 bg-gray-50 p-4 rounded-md w-55 cursor-pointer"
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
