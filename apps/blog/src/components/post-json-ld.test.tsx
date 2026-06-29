import { render } from '@testing-library/react';
import { PostJsonLd } from './post-json-ld';
import { PostModel, SeriesModel } from '@libs/types/commons';

const series: SeriesModel = { id: 'frontend', title: 'Frontend', date: '2026-01-01' };
const post: PostModel = {
  id: 'my-post',
  route: '/posts/frontend/my-post',
  series,
  title: '내 포스트 제목',
  tags: [{ id: 'react' }, { id: 'nextjs' }],
  date: '2026-01-02 10:00',
};

// 렌더된 <script type="application/ld+json">의 내용을 파싱해 반환한다.
function renderJsonLd() {
  const { container } = render(<PostJsonLd post={post} series={series} />);
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script?.textContent ?? '{}');
}

describe('PostJsonLd', () => {
  it('BlogPosting 스키마와 핵심 필드를 출력한다', () => {
    const data = renderJsonLd();

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBe('내 포스트 제목');
    expect(data.articleSection).toBe('Frontend');
    expect(data.keywords).toEqual(['react', 'nextjs']);
    expect(data.inLanguage).toBe('ko');
  });

  it('url은 사이트 URL + route를 이중 슬래시 없이 연결한다 (#84 회귀 방지)', () => {
    const data = renderJsonLd();

    expect(data.url).toBe('https://blog.malloc72p.com/posts/frontend/my-post');
    // 프로토콜(https://)을 제외하면 연속 슬래시가 없어야 한다.
    expect(data.url.replace('https://', '')).not.toContain('//');
  });

  it('datePublished/dateModified는 타임존 오프셋을 포함한 ISO 8601이다 (#84 회귀 방지)', () => {
    const data = renderJsonLd();

    // DateUtil이 Asia/Seoul을 강제하므로 머신 TZ와 무관하게 +09:00이 된다.
    expect(data.datePublished).toBe('2026-01-02T10:00:00+09:00');
    expect(data.dateModified).toBe(data.datePublished);
  });
});
