import { Lorem } from '@libs/debug';
import { getPosts } from '@libs/api/get-posts';
import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

/**
 * Main Layout
 *
 * 포스트, 시리즈, 태그 페이지는 해당 레이아웃을 기본적으로 사용한다
 */
export default async function MainLayout({ children }: PropsWithChildren) {
  const posts = await getPosts({
    limit: 20,
  });

  return (
    <div className="blog-main-layout h-full">
      {/* ------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------ */}
      <header className={classNames('blog-main-header h-[128px] bg-black', 'px-5 text-white')}>
        <div className="flex items-center max-w-[1400px] h-full mx-auto">
          <h1 className="text-[40px]">Malloc72p.Tech</h1>
          <span className="grow"></span>
          <div className="flex gap-5">
            <div>About Me</div>
            <div>Series</div>
            <div>Topics</div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <div className="blog-landing-main relative z-10 min-h-[100vh] bg-white">{children}</div>

      {/* ------------------------------------------------------ */}
      {/* Footer */}
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
