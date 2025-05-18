'use-client';

import { PropsWithChildren, useMemo } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './copy-button';

export interface PostCodeblockProps extends PropsWithChildren {}

export function PostCodeblock(props: PostCodeblockProps) {
  const { children } = props;

  const language = (children as any)?.props?.className;

  const codeString = useMemo<string>(() => {
    const obj = children as any;

    return obj?.props?.children || 'CodeBlock Error!';
  }, [children]);

  return (
    <div className="blog-code relative">
      <Prism
        language={language ? language.replace('language-', '') : 'js'}
        showLineNumbers
        style={darcula}
      >
        {codeString}
      </Prism>

      <CopyButton content={codeString} />
    </div>
  );
}
