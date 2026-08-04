import { SeriesDetail } from '@components/series-detail/series-detail';
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  seriesId: 'backend',
  title: '백엔드',
  description: '데이터베이스·ORM·인프라 등 서버사이드 주제를 다루는 시리즈입니다.',
  date: '2026-07-20 09:00',
  isSeriesLanding: true,
});

export default async function SeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}
