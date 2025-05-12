import { SeriesDetail } from '@components/series-detail/series-detail';
import { DateUtil } from '@libs/date-util';

export default async function BlogMakingSeriesPage() {
  return <SeriesDetail series={{ ...metadata }} />;
}

export const metadata = {
  id: 'blog-making-series',
  description:
    'Next.js와 Vercel을 통해 개인 기술 블로그를 직접 구현한 스토리를 다루는 시리즈 입니다.',
  title: '블로그 만들기 프로젝트',
  date: '2025-03-08 21:18',
  isSeriesLanding: true,
};
