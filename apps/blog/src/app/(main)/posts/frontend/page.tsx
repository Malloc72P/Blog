import { SeriesDetail } from '@components/series-detail/series-detail';

export const metadata = {
  id: 'frontend',
  description: '프론트엔드에 대해 학습한 내용을 다루는 시리즈입니다.',
  title: '프론트엔드',
  date: '2025-03-12 21:03',
  isSeriesLanding: true,
};

export default async function BlogMakingSeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}
