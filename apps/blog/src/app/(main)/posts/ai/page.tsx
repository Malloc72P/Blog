import { SeriesDetail } from '@components/series-detail/series-detail';
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  seriesId: 'ai',
  title: '인공지능',
  description: '인공지능에 대한 내용을 다루는 시리즈입니다.',
  date: '2026-02-11 22:07',
  isSeriesLanding: true,
});

export default async function SeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}
