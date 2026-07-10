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
 * autoPlay + muted + loop + playsInline 조합으로 GIF와 동일한 시청 경험을 유지하면서,
 * H.264(mp4) 인코딩으로 GIF 대비 전송량을 크게 줄인다.
 * next/image의 최적화 파이프라인(애니메이션 이미지에 비효율적)을 거치지 않는다.
 */
export function PostVideo({ src, caption, width, height }: PostVideoProps) {
  return (
    <span className="block text-center">
      {/* 음성 트랙이 없는 화면 녹화 영상이므로 캡션 트랙 대신 aria-label로 내용을 설명한다. */}
      <video
        className="rounded-md mx-auto shadow-xl"
        src={src}
        width={width}
        height={height}
        // PostImage와 동일하게 표시폭이 달라져도 종횡비를 유지한다.
        style={{ width: '100%', height: 'auto' }}
        autoPlay
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
