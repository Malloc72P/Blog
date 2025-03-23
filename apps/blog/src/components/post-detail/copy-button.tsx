'use client';

import { IconCopy } from '@tabler/icons-react';

export interface CopyButtonProps {
  content: string;
}

/**
 * 이렇게 하지 않으면 Event handlers cannot be passed to Client Component props. 에러가 발생한다.
 * MDX를 서버에서 파싱하고 리액트 컴포넌트로 렌더링하기 때문이다.
 * 이 컴포넌트에 이벤트 바인딩 코드가 있는 경우, 직렬화가 불가능하기 때문에, 위와 같은 에러가 터진다.
 * 한편 훅은 사용할 수 있는데, 그냥 실행하지 않았던데다, props로 내리는 등의 문제가 없었기 때문으로 보인다.
 * 원래대로라면 SSR에서 PostCodeBlock은 클라이언트 컴포넌트이므로 핸들러 바인딩 코드가 무시되고,
 * 정적인 HTML만 렌더링되었어야 한다. 하지만 MDX 파싱의 결과로 사용되는 과정에서, use client가 무시되고,
 * 서버 컴포넌트처럼 취급되다 보니, 무시되었어야 하는 이벤트 핸들러 바인딩이 서버사이드에서 발생해버려서,
 * 위의 에러가 터진 것으로 추측된다.
 *
 * 여튼 이 문제를 해결하려면, 이벤트 핸들러 바인딩 로직이 필요한 컴포넌트를 별도의 클라이언트 컴포넌트로 분리하는 것이다.
 * 이렇게 하면 PostCodeBlock은 서버 컴포넌트처럼 취급되더라도, 자식 컴포넌트는 정상적으로 클라이언트 사이드에서 처리된다.
 *
 */
export function CopyButton({ content }: CopyButtonProps) {
  return (
    <button
      className="absolute right-5 top-5 p-2 rounded-md opacity-80 hover:opacity-90 active:opacity-100"
      onClick={() => {
        navigator.clipboard.writeText(content);
      }}
    >
      <IconCopy className="w-5 h-5 stroke-gray-300" title="Copy code to clipboard" />
    </button>
  );
}
