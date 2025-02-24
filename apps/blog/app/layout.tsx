import { getPosts, getTags } from '@libs/get-posts';
import { PropsWithChildren } from 'react';
import './global.css';

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
            <div key={post.route}>{post.title}</div>
          ))}
        </div>

        <div>
          <h1>Tags</h1>
          {tags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
        </div>
      </body>
    </html>
  );
}
