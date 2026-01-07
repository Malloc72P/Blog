'use client';

import { usePost, useSeries } from '@libs/hooks/use-blog-item-finder';
import { usePathname } from 'next/navigation';
import { useContext, useMemo } from 'react';
import { MainLayoutContext } from 'src/app/(main)/main-client-layout';
import { PostDetail } from './post-detail';

interface MdxWrapperProps {
  children: React.ReactNode;
}

export function MdxWrapper({ children }: MdxWrapperProps) {
  const pathname = usePathname();
  const { postId, seriesId } = useMemo(() => extractIds(pathname), [pathname]);
  const { tags } = useContext(MainLayoutContext);

  const series = useSeries({ seriesId });
  const post = usePost({ postId });

  //   console.log('id list', postId, seriesId);
  //   console.log('series: ', series);
  //   console.log('post: ', post);

  if (!series || !post) return null;

  return (
    <PostDetail series={series} post={post} toc={[]} tags={tags} bottomContent={undefined}>
      {children}
    </PostDetail>
  );
}

function extractIds(pathname: string) {
  // /posts/frontend/debouncing-and-throttling
  const segments = pathname.split('/');
  const seriesId = segments[2];
  const postId = segments[3];

  return { seriesId, postId };
}
