import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostCard } from '@components/post-card';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, TagModel } from '@libs/types/commons';
import Link from 'next/link';

export interface TagDetailProps {
  tag: TagModel;
  posts: PostModel[];
}

export async function TagDetail({ tag, posts }: TagDetailProps) {
  return (
    <ArticleContainer>
      <div className="pb-[200px]">
        <ArticleHeader subTitle={'Malloc72p.Tech.Tag'} title={tag.id} />

        <Divider />

        <article className="py-[65px]">
          {/* 방어적 빈 상태: 해당 태그에 글이 없으면 안내 문구와 이동 링크를 노출한다. */}
          {posts.length === 0 ? (
            <TagDetailEmptyState />
          ) : (
            posts.map((post) => <PostCard key={post.route} post={post} series={post.series} />)
          )}
        </article>
      </div>
    </ArticleContainer>
  );
}

// 글이 없는 태그를 위한 빈 상태 UI. 홈/태그 인덱스로 돌아갈 수 있는 경로를 제공한다.
function TagDetailEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center text-gray-600">
      <p>이 태그에 해당하는 글이 아직 없습니다.</p>
      <div className="flex gap-5">
        <Link href={PageLinkMap.main.landing()} className="underline hover:text-gray-900">
          홈으로
        </Link>
        <Link href={PageLinkMap.tags.index()} className="underline hover:text-gray-900">
          전체 태그 보기
        </Link>
      </div>
    </div>
  );
}
