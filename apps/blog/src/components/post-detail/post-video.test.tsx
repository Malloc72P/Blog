import { render, screen } from '@testing-library/react';
import { PostVideo } from './post-video';

describe('PostVideo', () => {
  it('GIF와 동일한 경험을 위해 autoPlay/loop/muted/playsInline 영상으로 렌더된다', () => {
    const { container } = render(
      <PostVideo src="/sse-exam.mp4" caption="SSE 예제 화면" width={642} height={416} />,
    );

    const video = container.querySelector('video');

    // video 엘리먼트가 실제로 렌더되어야 한다(이미지 최적화 파이프라인을 우회).
    expect(video).not.toBeNull();

    if (!video) {
      return;
    }

    expect(video).toHaveAttribute('src', '/sse-exam.mp4');
    // GIF처럼 사용자 조작 없이 무한 반복 재생되어야 한다(자동재생 정책상 muted 필수).
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('playsinline');
    // 레이아웃 시프트 방지를 위해 원본 픽셀 크기를 예약한다.
    expect(video).toHaveAttribute('width', '642');
    expect(video).toHaveAttribute('height', '416');
    // 스크린리더가 영상 내용을 알 수 있도록 캡션 텍스트를 aria-label로 제공한다.
    expect(video).toHaveAttribute('aria-label', 'SSE 예제 화면');
  });

  it('캡션 텍스트를 본문에 함께 노출한다', () => {
    render(<PostVideo src="/create-chart.mp4" caption="차트 생성 화면" width={1340} height={616} />);

    // PostImage와 동일한 캡션 표기(따옴표 감싸기)를 유지한다.
    expect(screen.getByText('"차트 생성 화면"')).toBeInTheDocument();
  });
});
