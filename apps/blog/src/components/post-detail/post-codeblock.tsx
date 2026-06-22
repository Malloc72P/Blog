import React, { PropsWithChildren } from 'react';
import { PostCodeblockClient } from './post-codeblock-client';

// children만 받으므로 빈 인터페이스 대신 타입 별칭으로 둔다.
export type PostCodeblockProps = PropsWithChildren;

export function PostCodeblock(props: PostCodeblockProps) {
  const { children } = props;
  const codeProps = (children as React.ReactElement<{ className?: string; children?: string }>)?.props;

  const language = codeProps?.className?.replace('language-', '') ?? '';
  const code = codeProps?.children ?? '';

  return <PostCodeblockClient language={language} code={code} />;
}
