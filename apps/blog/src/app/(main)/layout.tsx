import { loadMainLayoutData } from '@libs/api/load-layout-data';
import { PropsWithChildren } from 'react';
import MainClientLayout from './main-client-layout';

export const dynamic = 'force-static';

/**
 * Main Layout
 *
 * 포스트, 시리즈, 태그 페이지는 해당 레이아웃을 기본적으로 사용한다
 */
export default async function MainLayout({ children }: PropsWithChildren) {
  const { seriesModels, tags, posts: loadedPosts } = await loadMainLayoutData();
  // 시리즈 내 이전/다음 글 계산을 위해 날짜 오름차순으로 정렬한다.
  const posts = [...loadedPosts].sort((a, b) => a.date.localeCompare(b.date));
  const postDesc = posts.slice().reverse();

  const preparedPosts = posts.map((currentPost) => ({
    ...currentPost,
    prevPost: postDesc.find(
      (post) => post.series.id === currentPost.series.id && post.date < currentPost.date,
    ),
    nextPost: posts.find(
      (post) => post.series.id === currentPost.series.id && post.date > currentPost.date,
    ),
  }));

  return (
    <MainClientLayout seriesList={seriesModels} tags={tags} posts={preparedPosts}>
      {children}
    </MainClientLayout>
  );
}
