'use client';

import { ComponentPropsWithoutRef, useRef } from 'react';
import { CopyButton } from './copy-button';

// rehype-pretty-code가 빌드타임에 하이라이팅한 <pre>를 그대로 받기 위해 기본 pre 속성을 모두 허용한다.
export type PostCodeblockClientProps = ComponentPropsWithoutRef<'pre'>;

/**
 * 빌드타임(shiki)에 하이라이팅된 <pre> 마크업을 그대로 렌더하고,
 * 우상단에 복사 버튼을 오버레이하는 클라이언트 래퍼.
 * 복사 원문은 pre의 textContent에서 읽으므로 별도로 코드 문자열을 prop으로 받지 않는다.
 * (라인넘버는 CSS ::before 카운터라 textContent에 포함되지 않는다.)
 */
export function PostCodeblockClient({ children, ...preProps }: PostCodeblockClientProps) {
  // 복사 시 원문 텍스트를 읽어올 대상 pre 엘리먼트 참조.
  const preRef = useRef<HTMLPreElement>(null);

  // 클립보드에 넣을 코드 원문을 pre의 textContent에서 가져온다.
  const getCode = () => preRef.current?.textContent ?? '';

  return (
    <div className="blog-code relative">
      {/* rehype-pretty-code가 주입한 data-* 속성과 인라인 배경 스타일을 그대로 전달한다. */}
      <pre ref={preRef} {...preProps}>
        {children}
      </pre>
      <CopyButton getContent={getCode} />
    </div>
  );
}
