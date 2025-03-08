import { SeriesPostList } from '@components/series-post-list';

export default async function BlogMakingSeriesPage() {
  return (
    <>
      <h1>블로그 만들기 프로젝트</h1>

      <SeriesPostList route="blog-making-series" />
    </>
  );
}
