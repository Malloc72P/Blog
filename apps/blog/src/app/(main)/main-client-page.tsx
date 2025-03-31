'use client';

import { IntroduceCard } from '@components/introduce-card';
import { PostCard } from '@components/post-card';
import { SeriesBadge } from '@components/series-badge';
import { Constants } from '@libs/constants';
import { DateUtil } from '@libs/date-util';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { IconArrowRight } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';
import { MainLayoutContext } from './main-client-layout';
import { ArticleContainer } from '@components/article-container';

export interface MainClientPageProps {
  seriesPosts: Record<string, PostModel[]>;
}

interface SeriesFilterModel extends SeriesModel {
  active: boolean;
}

/**
 * 블로그 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 * 소개 카드 및 포스트 필터, 포스트 목록이 표시된다
 */
export function MainClientPage({ seriesPosts }: MainClientPageProps) {
  /* ------------------------------------------------------ */
  /* CONTEXT */
  /* ------------------------------------------------------ */
  const { seriesList, tags } = useContext(MainLayoutContext);

  /* ------------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------------ */
  // 원본 포스트 목록
  const originalPosts = useMemo(
    () => Object.values(seriesPosts).flat().sort(DateUtil.postSorter),
    [seriesPosts]
  );

  // 현재 선택된 시리즈 필터
  const [currentSeriesFilter, setCurrentSeriesFilter] = useState<SeriesFilterModel>(
    seriesList.find((series) => series.id === Constants.series.latestId) as SeriesFilterModel
  );

  // 시리즈 필터
  const [seriesFilters, setSeriesFilters] = useState<SeriesFilterModel[]>(
    seriesList.map((s) => ({ ...s, active: s.id === currentSeriesFilter.id }))
  );

  // 현재 포스트 목록
  const [posts, setPosts] = useState<PostModel[]>(originalPosts);

  /* ------------------------------------------------------ */
  /* FUNCTIONS */
  /* ------------------------------------------------------ */
  const changeSeriesFilter = (nextSeriesId: string) => {
    const targetSeries = seriesFilters.find((series) => series.id === nextSeriesId);

    if (!targetSeries) {
      console.error('series not found');
      return;
    }

    // 현재 선택된 시리즈 필터 갱신
    setCurrentSeriesFilter(targetSeries);

    // 선택된 시리즈의 액티브 상태를 활성화한다.
    targetSeries.active = true;

    // 다른 시리즈의 액티브 상태를 해제한다.
    const otherSeriesList = seriesFilters.filter((series) => series.id !== targetSeries.id);
    otherSeriesList.forEach((series) => (series.active = false));

    setSeriesFilters([...seriesFilters]);

    // 현재 포스트 목록을 필터링한다.
    const nextPosts =
      targetSeries.id === Constants.series.latestId
        ? [...originalPosts]
        : originalPosts.filter((post) => post.series.id === targetSeries.id);

    setPosts(nextPosts);
  };

  /* ------------------------------------------------------ */
  /* ### RENDER ###  */
  /* ------------------------------------------------------ */

  return (
    <ArticleContainer>
      <div className="blog-landing-page pb-[10rem]">
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
          {
            <Link href={PageLinkMap.series.landing(currentSeriesFilter.id)}>
              <div
                className={classNames(
                  'font-bold flex items-center gap-2 cursor-pointer px-3',
                  'opacity-70 hover:opacity-90 active:opacity-100',
                  'text-xs sm:text-[16px]'
                )}
              >
                <span>포스트 더 보기</span>
                <IconArrowRight className="w-4 h-4" />
              </div>
            </Link>
          }
        </div>
      </div>
    </ArticleContainer>
  );
}
