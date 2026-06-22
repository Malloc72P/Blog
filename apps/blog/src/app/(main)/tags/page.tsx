import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { TagBadge } from '@components/tag-badge';
import { findPosts } from '@libs/api/find-posts';
import { findTags } from '@libs/api/find-tags';
import { PageLinkMap } from '@libs/page-link-map';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tagCount = (await findTags()).length;

  return {
    title: 'Tags',
    description: `블로그의 전체 태그 ${tagCount}개를 모아보는 페이지입니다.`,
    // 표기 일관성을 위해 canonical 경로를 명시한다.
    alternates: {
      canonical: PageLinkMap.tags.index(),
    },
  };
}

export default async function TagsIndexPage() {
  // 전체 태그와 전체 글을 조회한다.
  const tags = [...new Set(await findTags())];
  const posts = await findPosts();

  // 태그별 글 개수를 미리 집계해 배지 옆에 함께 표기한다.
  const countByTag = new Map<string, number>();
  posts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => {
      countByTag.set(tag, (countByTag.get(tag) ?? 0) + 1);
    });
  });

  return (
    <ArticleContainer>
      <div className="pb-[200px]">
        {/* 기존 시리즈/태그 상세와 동일한 헤더 레이아웃을 재사용해 일관성을 유지한다. */}
        <ArticleHeader subTitle={'Malloc72p.Tech.Tags'} title={'Tags'} />

        <Divider />

        <article className="py-[65px]">
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              // 태그 배지와 글 개수를 함께 묶어 노출한다.
              <span key={tag} className="flex items-center gap-1">
                <TagBadge tagId={tag} />
                <span className="text-xs text-gray-500 md:text-sm">{countByTag.get(tag) ?? 0}</span>
              </span>
            ))}
          </div>
        </article>
      </div>
    </ArticleContainer>
  );
}
