import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostCard } from '@components/post-card';
import { PostModel, TagModel } from '@libs/types/commons';

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
          {posts.map((post) => (
            <PostCard key={post.route} post={post} series={post.series} />
          ))}
        </article>
      </div>
    </ArticleContainer>
  );
}
