'use client';

import { IntroduceCard } from '@components/introduce-card';
import { PostCard } from '@components/post-card';
import { SeriesBadge } from '@components/series-badge';
import { PostModel, SeriesModel } from '@libs/types/commons';
import { Item } from 'nextra/normalize-pages';
import { useState } from 'react';

export interface LandingPageClient {
  seriesList: SeriesModel[];
  posts: PostModel[];
}

interface SeriesFilterModel extends SeriesModel {
  active: boolean;
}

const VIRTUAL_SERIES_LIST = 'latest' as const;
const VIRTUAL_SERIES: Record<typeof VIRTUAL_SERIES_LIST, SeriesFilterModel> = {
  latest: {
    id: VIRTUAL_SERIES_LIST,
    title: '최신글',
    active: true,
  },
};

/**
 * 블로그 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 * 소개 카드 및 포스트 필터, 포스트 목록이 표시된다
 */
export function LandingPageClient({ seriesList, posts }: LandingPageClient) {
  /* ------------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------------ */
  const [currentSeriesFilter, setCurrentSeriesFilter] = useState<SeriesFilterModel>(
    VIRTUAL_SERIES.latest
  );
  const [seriesFilters, setSeriesFilters] = useState<SeriesFilterModel[]>([
    VIRTUAL_SERIES.latest,
    ...seriesList.map((s) => ({ ...s, active: false })),
  ]);

  /* ------------------------------------------------------ */
  /* FUNCTIONS */
  /* ------------------------------------------------------ */
  const changeSeriesFilter = (nextSeriesId: string) => {
    const targetSeries = seriesFilters.find((series) => series.id === nextSeriesId);

    if (!targetSeries) {
      console.error('series not found');
      return;
    }

    targetSeries.active = true;

    const otherSeriesList = seriesFilters.filter((series) => series.id !== targetSeries.id);
    otherSeriesList.forEach((series) => (series.active = false));

    setCurrentSeriesFilter(targetSeries);
  };

  return (
    <div className="blog-landing-page pb-[200px]">
      {/* ------------------------------------------------------ */}
      {/* INTRODUCE CARD */}
      {/* ------------------------------------------------------ */}
      <IntroduceCard />

      {/* ------------------------------------------------------ */}
      {/* SERIES */}
      {/* ------------------------------------------------------ */}
      <div className="my-[30px] md:my-[65px] flex flex-wrap gap-5">
        {seriesFilters.map((series) => (
          <SeriesBadge
            key={series.id}
            seriesId={series.id}
            title={series.title}
            color={series.active ? 'primary' : 'secondary'}
            onClick={() => changeSeriesFilter(series.id)}
          />
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* DIVIDER */}
      {/* ------------------------------------------------------ */}
      <div className="bg-gray-200 h-[1px]"></div>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <div className="my-[30px] md:my-[65px]">
        {posts.map((post) => {
          const series = seriesList.find((currentSeries) => currentSeries.id === post.series.id);

          if (!series) {
            return;
          }

          return <PostCard key={post.route} post={post} series={series} />;
        })}
      </div>
    </div>
  );
}
