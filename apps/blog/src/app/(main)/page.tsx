import { IntroduceCard } from '@components/introduce-card';
import { LandingPageClient } from '@components/landing-page-client';
import { PostCard } from '@components/post-card';
import { SeriesBadge } from '@components/series-badge';
import { getPosts } from '@libs/api/get-posts';
import { getSeriesList } from '@libs/api/get-series';
import { PostModel, SeriesModel } from '@libs/types/commons';

/**
 * 블로그 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 * 소개 카드 및 포스트 필터, 포스트 목록이 표시된다
 */
export default async function LandingPage() {
  const posts = await getPosts({
    limit: 20,
  });

  const seriesList = await getSeriesList();

  const seriesModels: SeriesModel[] = seriesList.map((series) => ({
    id: series.frontMatter.id,
    title: series.title,
  }));

  const postModels: PostModel[] = posts.map((post) => {
    const series = seriesModels.find((series) => series.id === post.frontMatter.series);

    if (!series) {
      throw new Error('Series Not Found!!!');
    }

    return {
      route: post.route,
      title: post.frontMatter.title,
      series: series,
      tags: post.frontMatter.tags.map((tag: string) => ({ id: tag })),
    };
  });

  return <LandingPageClient posts={postModels} seriesList={seriesModels} />;
}
