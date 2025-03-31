import { PropsWithChildren, ReactElement } from 'react';

export interface ArticleContainerProps extends PropsWithChildren {
  right?: ReactElement;
}

export function ArticleContainer({ children, right }: ArticleContainerProps) {
  return (
    <div className="article-container relative z-10 min-h-[100vh] bg-white flex">
      <div className="grow basis-0 relative"></div>
      <div className="max-w-[1080px] w-full px-5 sm:px-10">{children}</div>
      <div className="grow basis-0 relative">{right}</div>
    </div>
  );
}
