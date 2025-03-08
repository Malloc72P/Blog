import { Lorem } from '@libs/debug';
import { getPosts } from '@libs/api/get-posts';
import classNames from 'classnames';
import Link from 'next/link';

/**
 * 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 */
export default async function LandingPage() {
  const posts = await getPosts({
    limit: 20,
  });

  return (
    <div className="blog-landing-page h-full">
      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      {posts.map((post) => (
        <div key={post.route} className="py-5 px-3 border rounded-md shadow-sm mb-5">
          <Link href={post.route}>
            <p className="text-lg">{post.title}</p>
          </Link>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="border px-3 py-1 rounded-md">
              <Link href={`/posts/${post.frontMatter.series}`}>{post.frontMatter.series}</Link>
            </span>
            {post.frontMatter.tags.map((tag: string) => (
              <span className="border px-3 py-1 rounded-md" key={tag}>
                <Link href={`/tags/${tag}`}>{tag}</Link>
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
    </div>
  );
}
