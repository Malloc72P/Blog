import { PropsWithChildren, ReactElement } from 'react';

export interface ArticleContainerProps extends PropsWithChildren {
  right?: ReactElement;
  jsonLd?: ReactElement;
}

export function ArticleContainer({ children, right, jsonLd }: ArticleContainerProps) {
  return (
    <main
      // skip 링크(본문 바로가기)의 이동 대상. tabIndex=-1로 프로그램적 포커스를 받을 수 있게 한다.
      id="main-content"
      tabIndex={-1}
      className="article-container relative z-10 min-h-[100vh] bg-white flex outline-none"
    >
      {jsonLd}
      <div className="grow basis-0 relative"></div>
      <div className="max-w-[1024px] w-full px-5 sm:px-10">{children}</div>
      <div className="grow basis-0 relative">{right}</div>
    </main>
  );
}
