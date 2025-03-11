import { SeriesPostList } from '@components/series-post-list';
import { DateUtil } from '@libs/date-util';

export default async function BlogMakingSeriesPage() {
  return (
    <>
      <h1>블로그 만들기 프로젝트</h1>

      <SeriesPostList seriesId="blog-making-series" />
    </>
  );
}

export const metadata = {
  id: 'blog-making-series',
  title: '블로그 만들기 프로젝트',
  date: DateUtil.Dayjs('2025-03-08 21:18'),
  isSeriesLanding: true,
};
