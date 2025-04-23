import { SeriesDetail } from '@components/series-detail/series-detail';
import { DateUtil } from '@libs/date-util';

export default async function LatestPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}

export const metadata = {
  id: 'latest',
  title: '최신글',
  date: '2025-02-08 21:18',
  isSeriesLanding: true,
};
