import { SeriesDetail } from '@components/series-detail/series-detail';
import { DateUtil } from '@libs/date-util';

export default async function BlogMakingSeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}

export const metadata = {
  id: 'blog-making-series',
  title: '블로그 만들기 프로젝트',
  date: DateUtil.Dayjs('2025-03-08 21:18'),
  isSeriesLanding: true,
};
