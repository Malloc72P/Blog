import { render, screen } from '@testing-library/react';
import { PostModel, SeriesModel } from '@libs/types/commons';
import { PostDetail } from './post-detail';

// giscus는 외부 위젯(웹 컴포넌트) 로드를 시도하므로 테스트에서는 렌더하지 않는다.
jest.mock('./giscus-comments', () => ({
  GiscusComments: () => null,
}));

// jsdom은 scrollIntoView를 구현하지 않으므로 목으로 대체한다(딥링크 스크롤 검증에 사용).
const scrollIntoViewMock = jest.fn();

beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoViewMock;

  // jsdom은 matchMedia도 구현하지 않는다. scrollToHeading의 reduced-motion 분기에서 필요한
  // 최소 형태(matches)만 목킹한다.
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(() => ({ matches: false })),
  });
});

const series: SeriesModel = { id: 'frontend', title: '프론트엔드', date: '2026-07-01 09:00' };

const post: PostModel = {
  id: 'sample-post',
  route: '/posts/frontend/sample-post',
  series,
  title: '샘플 포스트',
  tags: [],
  date: '2026-07-01 09:00',
};

function renderPostDetail() {
  return render(
    <PostDetail series={series} tags={[]} post={post}>
      <h2>Intro Section</h2>
      <p>본문 내용</p>
      <h2>Detail Section</h2>
      <p>상세 내용</p>
    </PostDetail>,
  );
}

describe('PostDetail', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    scrollIntoViewMock.mockClear();
  });

  it('본문 헤딩에 slug 기반 id를 부여하고 목차 링크를 렌더한다', () => {
    renderPostDetail();

    // 헤딩 수집 effect가 실제 DOM에 id를 부여해야 앵커/딥링크 대상이 된다.
    const heading = screen.getByRole('heading', { name: 'Intro Section' });
    expect(heading).toHaveAttribute('id', 'intro-section');
    // 데스크톱 패널 + 모바일 시트 두 곳에 같은 목차 링크가 렌더된다.
    expect(screen.getAllByRole('link', { name: 'Intro Section', hidden: true }).length).toBe(2);
  });

  it('URL 해시가 있으면 id 부여 완료 후 해당 헤딩으로 1회만 스크롤한다(딥링크)', () => {
    window.history.replaceState(null, '', '#detail-section');

    renderPostDetail();

    // Toc가 두 인스턴스(데스크톱·모바일) 마운트돼도 딥링크 스크롤은 PostDetail 한 곳에서
    // 정확히 1회만 실행돼야 한다(#85 리뷰 — 중복 스크롤 회귀 방지).
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    // 스크롤 대상은 해시가 가리키는 헤딩이어야 한다.
    expect(scrollIntoViewMock.mock.contexts[0]).toBe(
      screen.getByRole('heading', { name: 'Detail Section' }),
    );
  });

  it('URL 해시가 없으면 진입 시 스크롤하지 않는다', () => {
    renderPostDetail();

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
