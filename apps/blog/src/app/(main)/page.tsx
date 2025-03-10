import { IntroduceCard } from '@components/introduce-card';
import { LandingPageClient } from '@components/landing-page-client';
import { PostCard } from '@components/post-card';
import { SeriesBadge } from '@components/series-badge';
import { findPosts } from '@libs/api/find-posts';
import { getSeriesList } from '@libs/api/get-series';
import { Mapper } from '@libs/mapper';
import { PostModel, SeriesModel } from '@libs/types/commons';

/**
 * 블로그 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 * 소개 카드 및 포스트 필터, 포스트 목록이 표시된다
 */
export default async function LandingPage() {
  const seriesModels: SeriesModel[] = await getSeries();
  const seriesPosts: Record<string, PostModel[]> = {};

  for (const series of seriesModels) {
    const seriesPost = await findPosts({
      limit: 20,
      route: series.id,
    });

    seriesPosts[series.id] = seriesPost.map((item) => Mapper.toPostModel({ item, seriesModels }));
  }

  return <LandingPageClient seriesList={seriesModels} seriesPosts={seriesPosts} />;
}

async function getSeries() {
  const seriesList = await getSeriesList();

  const seriesModels: SeriesModel[] = seriesList.map(Mapper.toSeriesModel);
  return seriesModels;
}
