'use client';

import { useEffect, useRef } from 'react';

export interface PostVideoProps {
  src: string;
  // 영상이 보여주는 내용을 설명하는 텍스트. 캡션과 aria-label로 함께 사용한다.
  caption: string;
  // 레이아웃 시프트(CLS)를 막기 위해 원본 영상의 픽셀 크기를 받아 종횡비를 예약한다.
  width: number;
  height: number;
}

/**
 * 본문에서 애니메이션 GIF를 대체하는 영상 컴포넌트.
 *
 * muted + loop + playsInline 조합으로 GIF와 동일한 시청 경험을 유지하면서,
 * H.264(mp4) 인코딩으로 GIF 대비 전송량을 크게 줄인다.
 * next/image의 최적화 파이프라인(애니메이션 이미지에 비효율적)을 거치지 않는다.
 *
 * autoPlay 속성 대신 뷰포트 진입 시 play()를 호출한다.
 * - 본문 하단 영상이 첫 화면 렌더 전부터 다운로드되어 대역폭을 경쟁하는 문제(#97)를 막고,
 * - prefers-reduced-motion 설정 시 자동재생을 건너뛴다.
 * controls를 제공하므로 자동재생이 차단된 환경에서도 직접 재생할 수 있고,
 * 무한 반복 영상에 일시정지 수단이 생긴다(WCAG 2.2.2).
 */
export function PostVideo({ src, caption, width, height }: PostVideoProps) {
  // 뷰포트 관찰과 play() 호출을 위해 video 엘리먼트 참조를 잡아둔다.
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // 동작 줄이기 설정 시 자동재생을 하지 않는다. 사용자는 controls로 직접 재생할 수 있다.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // 뷰포트에 처음 들어올 때 한 번만 재생을 시작한다(그 이후 정지/재생은 사용자 몫).
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        // 자동재생이 차단된 환경이면 조용히 실패시키고 controls로 재생하게 둔다.
        video.play().catch(() => {});
        observer.disconnect();
      }
    });

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <span className="block text-center">
      {/* 음성 트랙이 없는 화면 녹화 영상이므로 캡션 트랙 대신 aria-label로 내용을 설명한다. */}
      <video
        ref={videoRef}
        className="rounded-md mx-auto shadow-xl"
        src={src}
        width={width}
        height={height}
        // PostImage와 동일하게 표시폭이 달라져도 종횡비를 유지한다.
        style={{ width: '100%', height: 'auto' }}
        // 초기 로드에서는 첫 프레임 표시에 필요한 메타데이터만 받고, 본편은 재생 시점에 받는다.
        preload="metadata"
        // 무한 반복 자동재생 영상의 일시정지 수단이자, 자동재생 차단 환경의 재생 수단.
        controls
        loop
        muted
        playsInline
        aria-label={caption}
      />
      <span className="block text-gray-600 text-center leading-[28px] italic py-5 break-words">
        &quot;{caption}&quot;
      </span>
    </span>
  );
}
