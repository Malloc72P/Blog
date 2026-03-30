'use client';

import { Prism } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './copy-button';

interface PostCodeblockClientProps {
  language: string;
  code: string;
}

export function PostCodeblockClient({ language, code }: PostCodeblockClientProps) {
  return (
    <div className="blog-code relative">
      <Prism language={language} showLineNumbers style={darcula}>
        {code}
      </Prism>
      <CopyButton content={code} />
    </div>
  );
}
