'use-client';

import { IconCopy } from '@tabler/icons-react';
import { PropsWithChildren, useMemo } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './copy-button';

export interface PostCodeblockProps extends PropsWithChildren {}

export function PostCodeblock({ children }: PostCodeblockProps) {
  const codeString = useMemo<string>(() => {
    const obj = children as any;

    return obj?.props?.children || 'CodeBlock Error!';
  }, [children]);

  return (
    <div className="relative">
      <Prism language="javascript" style={darcula} showLineNumbers>
        {codeString}
      </Prism>
      <CopyButton content={codeString} />
    </div>
  );
}
