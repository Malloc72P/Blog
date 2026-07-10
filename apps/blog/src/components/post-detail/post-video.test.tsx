import { act, render, screen } from '@testing-library/react';
import { PostVideo } from './post-video';

// jsdom에는 matchMedia/IntersectionObserver가 없으므로 테스트에서 직접 모킹한다.
// 각 테스트가 reduced-motion 여부와 뷰포트 진입을 제어할 수 있게 상태를 밖으로 꺼내둔다.
let prefersReducedMotion = false;
// 컴포넌트가 등록한 IntersectionObserver 콜백. 테스트에서 뷰포트 진입을 흉내낼 때 호출한다.
let intersectionCallback: IntersectionObserverCallback | undefined;

beforeEach(() => {
  prefersReducedMotion = false;
  intersectionCallback = undefined;

  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' && prefersReducedMotion,
    media: query,
  }));

  window.IntersectionObserver = jest
    .fn()
    .mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return { observe: jest.fn(), disconnect: jest.fn(), unobserve: jest.fn() };
    });
});

// 컴포넌트가 등록한 콜백에 "뷰포트 진입" 엔트리를 전달한다.
function enterViewport() {
  if (!intersectionCallback) {
    throw new Error('IntersectionObserver가 등록되지 않았다');
  }
  act(() => {
    if (intersectionCallback) {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
}

describe('PostVideo', () => {
  it('GIF와 동일한 경험을 위해 loop/muted/playsInline 영상으로 렌더된다', () => {
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
    // GIF처럼 무한 반복 재생되어야 한다(자동재생 정책상 muted 필수).
    expect(video).toHaveAttribute('loop');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('playsinline');
    // autoPlay 속성이 있으면 페이지 로드 즉시 다운로드가 시작되므로 쓰지 않는다(뷰포트 진입 시 play()).
    expect(video).not.toHaveAttribute('autoplay');
    // 초기 로드에서는 메타데이터만 받아 하단 영상의 대역폭 경쟁을 막는다.
    expect(video).toHaveAttribute('preload', 'metadata');
    // WCAG 2.2.2: 무한 반복 영상의 일시정지 수단이자 자동재생 차단 환경의 재생 수단.
    expect(video).toHaveAttribute('controls');
    // 레이아웃 시프트 방지를 위해 원본 픽셀 크기를 예약한다.
    expect(video).toHaveAttribute('width', '642');
    expect(video).toHaveAttribute('height', '416');
    // 스크린리더가 영상 내용을 알 수 있도록 캡션 텍스트를 aria-label로 제공한다.
    expect(video).toHaveAttribute('aria-label', 'SSE 예제 화면');
  });

  it('뷰포트에 들어오면 재생을 시작한다', () => {
    const playMock = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(playMock);

    render(<PostVideo src="/sse-exam.mp4" caption="SSE 예제 화면" width={642} height={416} />);

    // 뷰포트 진입 전에는 재생하지 않는다(초기 대역폭 절약).
    expect(playMock).not.toHaveBeenCalled();

    enterViewport();

    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('prefers-reduced-motion 설정 시 자동재생하지 않는다', () => {
    prefersReducedMotion = true;
    const playMock = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(playMock);

    render(<PostVideo src="/sse-exam.mp4" caption="SSE 예제 화면" width={642} height={416} />);

    // 동작 줄이기 설정 시 뷰포트 관찰 자체를 시작하지 않아야 한다(controls로만 재생).
    expect(intersectionCallback).toBeUndefined();
    expect(playMock).not.toHaveBeenCalled();
  });

  it('캡션 텍스트를 본문에 함께 노출한다', () => {
    render(<PostVideo src="/create-chart.mp4" caption="차트 생성 화면" width={1340} height={616} />);

    // PostImage와 동일한 캡션 표기(따옴표 감싸기)를 유지한다.
    expect(screen.getByText('"차트 생성 화면"')).toBeInTheDocument();
  });
});
