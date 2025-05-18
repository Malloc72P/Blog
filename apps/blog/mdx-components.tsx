import { PostImage } from '@components/post-detail';
import { PostCodeblock } from '@components/post-detail/post-codeblock';
import { PostDetail } from '@components/post-detail/post-detail';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { Mapper } from '@libs/mapper';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, SeriesModel, TagModel } from '@libs/types/commons';
import { NextraMetadata } from 'nextra';
import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components';
import { ReactElement } from 'react';

/**
 * Nextra 컴포넌트 구성 정보
 */
const defaultComponents = getNextraComponents({
  // mdx 페이지 컴포넌트.
  wrapper: async ({ children, toc, metadata, bottomContent }) => {
    const { series, seriesId, tags, title } = await resolveData(metadata);
    const postId = resolvePostId(metadata);

    if (!series || !postId) {
      console.error('데이터가 충분하지 않습니다', series, postId);
      throw new Error('데이터가 충분하지 않아 페이지 빌드에 실패했습니다.');
    }

    const seriesPosts = (await findPosts({ seriesId, orderBy: 'createAtASC' })).map((item) =>
      Mapper.toPostModel({ item, seriesModels: [series] }),
    );

    const postIndex = seriesPosts.findIndex((currentPost) => currentPost.title === title);

    const post: PostModel = {
      title: metadata.title,
      date: Reflect.get(metadata, 'date'),
      route: PageLinkMap.post.detail(seriesId, postId),
      tags,
      series,
      prevPost: postIndex > 0 ? seriesPosts[postIndex - 1] : undefined,
      nextPost: postIndex < seriesPosts.length - 1 ? seriesPosts[postIndex + 1] : undefined,
    };

    return (
      <>
        <PostDetail toc={toc} series={series} tags={tags} post={post} bottomContent={bottomContent}>
          {children}
        </PostDetail>
      </>
    );
  },
  //  이미지 컴포넌트 오버라이드
  img: PostImage,
  //  코드블록(```) 컴포넌트 오버라이드
  pre: PostCodeblock,
});

export const useMDXComponents = (components: ReactElement[]) => ({
  ...defaultComponents,
  ...components,
});

/**
 * MDX 프론트매터 정보를 읽고 필요한 데이터(seriesId, tags, ...)를 반환
 */
async function resolveData(metadata: NextraMetadata) {
  const seriesId = Reflect.get(metadata, 'series');
  const seriesList = (await findSeriesList()).map(Mapper.toSeriesModel);
  const series = seriesList.find((s) => s.id === seriesId);
  const tags = (Reflect.get(metadata, 'tags') as string[]).map(Mapper.toTagModel);
  const title = metadata.title;

  return { series, seriesId, tags, title };
}

/**
 * 라우트 경로에서 postId에 해당하는 문자열을 찾아서 반환
 */
function resolvePostId(metadata: NextraMetadata) {
  const regex = new RegExp(
    'src/app/\\(main\\)/posts/(?<series>[가-힣a-zA-Z0-9-]{1,})/(?<postId>[가-힣a-zA-Z0-9-]{1,})/page.mdx',
  );

  const postId = regex.exec(metadata.filePath)?.groups?.postId as string;

  return postId;
}
