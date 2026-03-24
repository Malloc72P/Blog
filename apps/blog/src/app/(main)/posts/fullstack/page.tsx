import { SeriesDetail } from '@components/series-detail/series-detail';
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  seriesId: 'fullstack',
  title: '풀스택',
  description: '풀스택 개발에 대해 다루는 시리즈입니다.',
  date: '2026-03-24 20:23',
  isSeriesLanding: true,
});

export default async function SeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}
