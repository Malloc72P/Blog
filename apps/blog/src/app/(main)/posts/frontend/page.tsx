import { SeriesPostList } from '@components/series-post-list';

export default async function FrontendPage() {
  return (
    <>
      <h1>프론트엔드 이야기</h1>

      <SeriesPostList route="frontend" />
    </>
  );
}
