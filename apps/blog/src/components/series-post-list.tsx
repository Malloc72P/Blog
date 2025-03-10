import { findPosts } from '@libs/api/find-posts';
import Link from 'next/link';

export interface SeriesPostListProps {
  route: string;
}

export async function SeriesPostList({ route }: SeriesPostListProps) {
  const posts = await findPosts({ route });

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
