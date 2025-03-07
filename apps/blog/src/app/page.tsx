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
      {/* HEADER */}
      {/* ------------------------------------------------------ */}
      <header
        className={classNames('blog-main-header h-[128px] bg-slate-300', 'flex items-center px-5')}
      >
        <h1 className="text-3xl">Malloc72p.Tech</h1>
        <span className="grow"></span>
        <div className="flex gap-5">
          <div>About Me</div>
          <div>Series</div>
          <div>Topics</div>
        </div>
      </header>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <div className="blog-landing-main bg-slate-100 min-h-[80%] relative z-10">
        <article className="pb-[400px] max-w-[1000px] h-full mx-auto pt-[100px]">
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
        </article>
      </div>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <footer
        className={classNames(
          'blog-footer h-[410px] bg-slate-300 sticky left-0 bottom-0',
          'opacity-80 border-t-4 border-slate-800 border-dashed'
        )}
      >
        {Array.from({ length: 3 }, (_, i) => (
          <p key={i}>{Lorem.p}</p>
        ))}
      </footer>
    </div>
  );
}
