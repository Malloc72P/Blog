import { findSeriesList } from '@libs/api/find-series';
import { findTags } from '@libs/api/find-tags';
import { Mapper } from '@libs/mapper';
import { PropsWithChildren } from 'react';
import MainClientLayout from './main-client-layout';
import { findPosts } from '@libs/api/find-posts';

export const dynamic = 'force-static';

/**
 * Main Layout
 *
 * 포스트, 시리즈, 태그 페이지는 해당 레이아웃을 기본적으로 사용한다
 */
export default async function MainLayout({ children }: PropsWithChildren) {
  const seriesModels = (await findSeriesList()).map(Mapper.toSeriesModel);
  const tags = (await findTags()).map(Mapper.toTagModel);
  const posts = (await findPosts()).map((item) => Mapper.toPostModel({ item, seriesModels }));

  return (
    <MainClientLayout seriesList={seriesModels} tags={tags} posts={posts}>
      {children}
    </MainClientLayout>
  );
}
