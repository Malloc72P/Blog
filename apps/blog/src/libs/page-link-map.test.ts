import { PageLinkMap } from '@libs/page-link-map';

describe('PageLinkMap', () => {
  it('main.landing은 루트 경로를 반환한다', () => {
    expect(PageLinkMap.main.landing()).toBe('/');
  });

  it('series.landing은 시리즈 경로를 만든다', () => {
    expect(PageLinkMap.series.landing('frontend')).toBe('/posts/frontend');
  });

  it('post.detail은 시리즈/포스트 경로를 만든다', () => {
    expect(PageLinkMap.post.detail('frontend', 'closure')).toBe('/posts/frontend/closure');
  });

  it('tags.index는 태그 인덱스 경로를 반환한다', () => {
    expect(PageLinkMap.tags.index()).toBe('/tags');
  });

  describe('tags.landing은 태그 ID를 URL 인코딩한다', () => {
    it('영문 태그는 그대로', () => {
      expect(PageLinkMap.tags.landing('Typescript')).toBe('/tags/Typescript');
    });
    it('공백은 %20으로', () => {
      expect(PageLinkMap.tags.landing('Git Worktree')).toBe('/tags/Git%20Worktree');
    });
    it('한글은 퍼센트 인코딩으로', () => {
      expect(PageLinkMap.tags.landing('타입시스템')).toBe(`/tags/${encodeURIComponent('타입시스템')}`);
    });
  });
});
