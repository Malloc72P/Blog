import { LandingPageClient } from '@components/landing-page-client';
import { findPosts } from '@libs/api/find-posts';
import { getSeriesList } from '@libs/api/get-series';
import { Constants } from '@libs/constants';
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
    if (series.id === Constants.series.latestId) {
      continue;
    }

    const seriesPost = await findPosts({
      limit: 20,
      seriesId: series.id,
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
