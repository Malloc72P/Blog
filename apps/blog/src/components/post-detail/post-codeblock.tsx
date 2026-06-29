import { ComponentPropsWithoutRef } from 'react';
import { PostCodeblockClient } from './post-codeblock-client';

// MDX의 pre 매핑 컴포넌트. rehype-pretty-code가 하이라이팅한 pre 속성을 그대로 받는다.
export type PostCodeblockProps = ComponentPropsWithoutRef<'pre'>;

export function PostCodeblock(props: PostCodeblockProps) {
  // 복사 버튼은 이벤트 핸들러가 필요해 별도 클라이언트 컴포넌트로 분리한다(copy-button.tsx 주석 참고).
  return <PostCodeblockClient {...props} />;
}
