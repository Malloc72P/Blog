import { findPosts } from '@libs/api/find-posts';
import Link from 'next/link';

export interface SeriesPostListProps {
  seriesId: string;
}

export async function SeriesPostList({ seriesId }: SeriesPostListProps) {
  const posts = await findPosts({ seriesId });

  return (
    <>
      {posts.map((post) => (
        <div key={post.route}>
          <Link href={post.route}>{post.name}</Link>
        </div>
      ))}
    </>
  );
}
