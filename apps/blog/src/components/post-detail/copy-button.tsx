'use client';

import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './post-detail.module.scss';
import classNames from 'classnames';

export interface CopyButtonProps {
  // 복사 시점에 코드 원문을 읽어오는 함수. 빌드타임 하이라이팅에선 pre의 textContent에서 읽으므로 함수로 받는다.
  getContent: () => string;
}

/**
 * PostCodeblock 컴포넌트와 분리해서 작성해야함.
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
export function CopyButton({ getContent }: CopyButtonProps) {
  // 복사 성공 여부를 상태로 관리해 클릭 후 일정 시간 체크 아이콘으로 피드백한다.
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // 클립보드 쓰기에 실패해도 화면이 깨지지 않도록 예외를 흡수한다.
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(true);
      // 1.5초 뒤 원래 복사 아이콘으로 되돌린다.
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 거부된 환경에서는 조용히 무시한다.
    }
  };

  return (
    <button
      type="button"
      // 복사 상태에 따라 aria-label을 바꿔 스크린리더에 결과를 알린다.
      aria-label={copied ? '코드 복사됨' : '코드 복사'}
      className={classNames(
        // p-3로 키워 터치 타겟을 약 44px 확보(아이콘 20px + 패딩 24px).
        'absolute right-5 top-5 p-3 rounded-md opacity-80 hover:opacity-90 active:opacity-100',
        // 키보드 포커스 시 시각적 표시(focus-visible ring)로 접근성을 높인다.
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
        classes.copyBtn
      )}
      onClick={handleCopy}
    >
      {copied ? (
        // 복사 성공 시 체크 아이콘으로 시각 피드백을 준다.
        <IconCheck className="w-5 h-5 stroke-green-400" title="복사됨" />
      ) : (
        <IconCopy className="w-5 h-5 stroke-gray-300" title="코드 복사" />
      )}
    </button>
  );
}
