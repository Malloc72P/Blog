import { findPosts } from '@libs/api/find-posts';
import classNames from 'classnames';
import { MenuIcon } from 'nextra/icons';
import { PropsWithChildren } from 'react';

/**
 * Main Layout
 *
 * 포스트, 시리즈, 태그 페이지는 해당 레이아웃을 기본적으로 사용한다
 */
export default async function MainLayout({ children }: PropsWithChildren) {
  const posts = await findPosts({
    limit: 20,
  });

  return (
    <div className="blog-main-layout h-full">
      {/* ------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------ */}
      <header
        className={classNames('blog-main-header bg-black text-white', 'h-[60px] md:h-[128px]')}
      >
        <div className="flex items-center max-w-[1400px] h-full mx-auto px-5">
          <h1 className="text-[16px] md:text-[40px]">Malloc72p.Tech</h1>
          <span className="grow"></span>

          {/* === HEADER >= MD: RIGHT SECTION === */}
          <div className="gap-5 hidden md:flex">
            <div>About Me</div>
            <div>Series</div>
            <div>Topics</div>
          </div>

          {/* === HEADER < MD: RIGHT SECTION === */}
          <div className="flex md:hidden">
            <MenuIcon className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <div className="blog-landing-main relative z-10 min-h-[100vh] bg-white">
        <div className="max-w-[1400px] mx-auto px-5">{children}</div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Footer */}
      {/* ------------------------------------------------------ */}
      <footer
        className={classNames(
          'blog-footer h-[410px] bg-slate-300 sticky left-0 bottom-0',
          'opacity-80 border-t-4 border-slate-800 border-dashed'
        )}
      ></footer>
    </div>
  );
}
