import { SeriesDetail } from '@components/series-detail/series-detail';
import { DateUtil } from '@libs/date-util';

export default async function FrontendPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}

export const metadata = {
  id: 'frontend',
  title: '프론트엔드 이야기',
  date: DateUtil.Dayjs('2025-03-08 21:18'),
  isSeriesLanding: true,
};
