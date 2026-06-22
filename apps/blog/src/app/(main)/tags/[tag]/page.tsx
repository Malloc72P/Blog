import { TagDetail } from '@components/tag-detail';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { findTags } from '@libs/api/find-tags';
import { Mapper } from '@libs/mapper';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, TagModel } from '@libs/types/commons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// generateStaticParams가 전체 태그를 반환하므로, 미정의 태그(오타/없는 태그)는 404로 처리한다.
export const dynamicParams = false;

export interface TagPageParams {
  // App Router 동적 세그먼트 params는 Promise로 전달된다.
  params: Promise<{ tag: string }>;
}

export async function generateMetadata(props: TagPageParams): Promise<Metadata> {
  const { tag } = await props.params;
  // URL 인코딩된 태그를 사람이 읽는 형태로 복원한다.
  const tagId = decodeURIComponent(tag);

  // 해당 태그가 달린 글 개수를 메타데이터 description에 활용한다.
  const matchedCount = await findPosts().then(
    (list) => list.filter((post) => post.frontMatter.tags?.includes(tagId)).length,
  );

  // 매칭되는 글이 없으면 검색엔진 색인에서 제외한다(빈 태그 페이지 노출 방지).
  const shouldIndex = matchedCount > 0;

  return {
    title: `Posts Tagged with “${tagId}”`,
    description: `${tagId} 태그가 달린 글 ${matchedCount}개`,
    // landing()이 내부에서 encodeURIComponent를 적용하므로 원본 tagId를 그대로 전달한다.
    alternates: {
      canonical: PageLinkMap.tags.landing(tagId),
    },
    robots: shouldIndex ? undefined : { index: false },
  };
}

export async function generateStaticParams() {
  const allTags = await findTags();
  return [...new Set(allTags)].map((tag) => ({ tag }));
}

export default async function TagPage(props: TagPageParams) {
  // 태그 조회 & 데이터 가공
  const { tag } = await props.params;
  const tagId = decodeURIComponent(tag);
  const tagModel: TagModel = { id: tagId };

  //   포스트 조회
  const posts = await findPosts().then((list) =>
    list.filter((post) => post.frontMatter.tags?.includes(tagId)),
  );

  // dynamicParams=false로 미정의 태그는 차단되지만, 정의된 태그라도 매칭 글이 0개면 방어적으로 404 처리한다.
  if (posts.length === 0) {
    notFound();
  }

  //   PostModel로 가공
  const seriesList = await findSeriesList();
  const seriesModels = seriesList.map(Mapper.toSeriesModel);
  const postModels: PostModel[] = posts
    .map((p) => Mapper.toPostModel({ item: p, seriesModels }))
    // 시리즈 미존재로 스킵된 포스트(null)를 제거해 PostModel[]로 좁힌다.
    .filter((post): post is PostModel => post !== null);

  return <TagDetail tag={tagModel} posts={postModels} />;
}
