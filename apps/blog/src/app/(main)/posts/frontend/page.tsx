import { SeriesPostList } from '@components/series-post-list';
import { DateUtil } from '@libs/date-util';

export default async function FrontendPage() {
  return (
    <>
      <h1>프론트엔드 이야기</h1>

      <SeriesPostList route="frontend" />
    </>
  );
}

export const metadata = {
  id: 'frontend',
  title: '프론트엔드 이야기',
  createdAt: DateUtil.Dayjs('2025-03-08 21:18'),
  isSeriesLanding: true,
};
