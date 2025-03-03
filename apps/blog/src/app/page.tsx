import { Lorem } from '@libs/debug';
import classNames from 'classnames';

/**
 * 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 */
export default function LandingPage() {
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
      <div className="blog-landing-main bg-slate-100 min-h-[100%] relative z-10">
        <article className="pb-[200px]">
          {Array.from({ length: 2 }, (_, i) => (
            <p key={i}>{Lorem.p}</p>
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
