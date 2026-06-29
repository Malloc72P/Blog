'use client';

import { IconBrandX, IconCheck, IconLink, IconShare } from '@tabler/icons-react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

export interface ShareButtonsProps {
  // 공유할 글의 정식(canonical) 절대 URL.
  url: string;
  // 공유 텍스트로 사용할 글 제목.
  title: string;
}

// 공통 버튼 스타일: 터치 타겟(약 44px) + 포커스 링.
const buttonClass = classNames(
  'flex items-center justify-center p-2.5 rounded-md text-gray-500',
  'hover:text-black hover:bg-gray-100 active:bg-gray-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
);

export function ShareButtons({ url, title }: ShareButtonsProps) {
  // 링크 복사 성공 피드백 상태.
  const [copied, setCopied] = useState(false);
  // navigator.share 지원 여부. SSR과 마크업이 어긋나지 않도록 마운트 후에만 반영한다.
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // 1.5초 뒤 원래 아이콘으로 되돌린다.
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 거부된 환경에서는 조용히 무시한다.
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // 사용자가 공유 시트를 취소하면 무시한다.
    }
  };

  // X(트위터) 공유 인텐트 URL. 제목과 링크를 쿼리로 안전하게 인코딩한다.
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="post-share mt-10 flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-gray-500">이 글 공유하기</span>

      {/* 링크 복사 */}
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? '링크 복사됨' : '링크 복사'}
        className={buttonClass}
      >
        {copied ? (
          <IconCheck className="h-5 w-5 stroke-green-500" />
        ) : (
          <IconLink className="h-5 w-5" />
        )}
      </button>

      {/* X(트위터) 공유 */}
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X(트위터)에 공유"
        className={buttonClass}
      >
        <IconBrandX className="h-5 w-5" />
      </a>

      {/* 모바일 등 지원 환경에서만 OS 네이티브 공유 시트를 띄운다. */}
      {canNativeShare && (
        <button type="button" onClick={nativeShare} aria-label="공유하기" className={buttonClass}>
          <IconShare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
