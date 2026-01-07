import { TagDetail } from '@components/tag-detail';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { findTags } from '@libs/api/find-tags';
import { Mapper } from '@libs/mapper';
import { PostModel, TagModel } from '@libs/types/commons';

export interface GenerateMetadataProps {
  params: any;
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const params = await props.params;

  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`,
  };
}

export async function generateStaticParams() {
  const allTags = await findTags();
  return [...new Set(allTags)].map((tag) => ({ tag }));
}

export interface TagPageProps {
  params: any;
}

export default async function TagPage(props: TagPageProps) {
  // 태그 조회 & 데이터 가공
  const params = await props.params;
  const tagId = decodeURIComponent(params.tag);
  const tagModel: TagModel = { id: tagId };

  //   포스트 조회
  const { title } = await generateMetadata({ params });
  const posts = await findPosts().then((list) =>
    list.filter((post) => post.frontMatter.tags?.includes(tagId)),
  );

  //   PostModel로 가공
  const seriesList = await findSeriesList();
  const seriesModels = seriesList.map(Mapper.toSeriesModel);
  const postModels: PostModel[] = posts.map((p) => Mapper.toPostModel({ item: p, seriesModels }));

  return <TagDetail tag={tagModel} posts={postModels} />;
}
