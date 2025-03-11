import { SeriesPostList } from '@components/series-post-list';
import { DateUtil } from '@libs/date-util';

export default async function LatestPage() {
  return (
    <>
      <h1>최신 글</h1>

      <SeriesPostList seriesId="latest" />
    </>
  );
}

export const metadata = {
  id: 'latest',
  title: '최신글',
  date: DateUtil.Dayjs('2025-02-08 21:18'),
  isSeriesLanding: true,
};
