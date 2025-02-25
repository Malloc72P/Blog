import { getPosts, getTags } from 'src/libs/get-posts';
import { PropsWithChildren } from 'react';
import './global.css';
import Link from 'next/link';
import { TagMap } from '@libs/tag-map';

export const metadata = {
  title: 'Malloc72P',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const posts = await getPosts();
  const tags = await getTags();

  console.log('tags', tags);

  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>

      <body>
        <div>
          <h1>Posts</h1>
          {posts.map((post) => (
            <div key={post.route}>
              <Link href={post.route}>{post.title}</Link>
            </div>
          ))}
        </div>

        <div>
          <h1>Tags</h1>
          {tags.map((tag) => {
            const tagInfo = TagMap[tag];

            return (
              <div key={tag}>
                <Link href={`/tags/${tag}`}>{tag}</Link>
              </div>
            );
          })}
        </div>

        {children}
      </body>
    </html>
  );
}
