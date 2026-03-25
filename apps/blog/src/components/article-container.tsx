import { PropsWithChildren, ReactElement } from 'react';

export interface ArticleContainerProps extends PropsWithChildren {
  right?: ReactElement;
  jsonLd?: ReactElement;
}

export function ArticleContainer({ children, right, jsonLd }: ArticleContainerProps) {
  return (
    <main className="article-container relative z-10 min-h-[100vh] bg-white flex">
      {jsonLd}
      <div className="grow basis-0 relative"></div>
      <div className="max-w-[1024px] w-full px-5 sm:px-10">{children}</div>
      <div className="grow basis-0 relative">{right}</div>
    </main>
  );
}
