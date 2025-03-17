import { PostDetail } from '@components/post-detail/post-detail';
import { findSeriesList } from '@libs/api/find-series';
import { Mapper } from '@libs/mapper';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { NextraMetadata } from 'nextra';
import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components';
import { ReactElement } from 'react';

const defaultComponents = getNextraComponents({
  wrapper: async ({ children, toc, metadata, bottomContent }) => {
    const { series, seriesId, tags } = await resolveData(metadata);
    const postId = resolvePostId(metadata);

    if (!series || !postId) {
      console.error('데이터가 충분하지 않습니다', series, postId);
      throw new Error('데이터가 충분하지 않아 페이지 빌드에 실패했습니다.');
    }

    const post: PostModel = {
      title: metadata.title,
      date: Reflect.get(metadata, 'date'),
      route: PageLinkMap.post.detail(seriesId, postId),
      tags,
      series,
    };

    return (
      <>
        <PostDetail toc={toc} series={series} tags={tags} post={post} bottomContent={bottomContent}>
          {children}
        </PostDetail>
      </>
    );
  },
});

export const useMDXComponents = (components: ReactElement[]) => ({
  ...defaultComponents,
  ...components,
});

async function resolveData(metadata: NextraMetadata) {
  const seriesId = Reflect.get(metadata, 'series');
  const seriesList = (await findSeriesList()).map(Mapper.toSeriesModel);
  const series = seriesList.find((s) => s.id === seriesId);
  const tags = (Reflect.get(metadata, 'tags') as string[]).map(Mapper.toTagModel);

  return { series, seriesId, tags };
}

function resolvePostId(metadata: NextraMetadata) {
  const regex = new RegExp(
    'src/app/\\(main\\)/posts/(?<series>[가-힣a-zA-Z0-9-]{1,})/(?<postId>[가-힣a-zA-Z0-9-]{1,})/page.mdx'
  );
  const postId = regex.exec(metadata.filePath)?.groups?.postId as string;

  return postId;
}
