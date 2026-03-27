import React, { PropsWithChildren } from 'react';
import { PostCodeblockClient } from './post-codeblock-client';

export interface PostCodeblockProps extends PropsWithChildren {}

export function PostCodeblock(props: PostCodeblockProps) {
  const { children } = props;
  const codeProps = (children as React.ReactElement<{ className?: string; children?: string }>)?.props;

  const language = codeProps?.className?.replace('language-', '') ?? '';
  const code = codeProps?.children ?? '';

  return <PostCodeblockClient language={language} code={code} />;
}
