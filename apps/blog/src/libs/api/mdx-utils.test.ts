import { parseFrontmatterMetadata } from '@libs/api/mdx-utils';

// 실제 page.mdx 상단 형태를 흉내 내어 frontmatter 호출 블록을 감싼다.
const wrap = (body: string) =>
  `import { frontmatter } from '@libs/frontmatter';\nexport const metadata = frontmatter({${body}});\n\n# 제목\n본문`;

describe('parseFrontmatterMetadata', () => {
  it('title/date/description/series/id/tags를 추출한다', () => {
    const fm = parseFrontmatterMetadata(
      wrap(`
      title: '클로저',
      description: '클로저 설명',
      seriesId: 'frontend',
      postId: 'closure',
      tags: ['Closure', 'JavaScript'],
      date: '2026-06-17 22:05',
    `),
    );

    expect(fm).toMatchObject({
      title: '클로저',
      description: '클로저 설명',
      series: 'frontend',
      id: 'closure',
      tags: ['Closure', 'JavaScript'],
      date: '2026-06-17 22:05',
    });
  });

  it('frontmatter 호출이 없으면 null', () => {
    expect(parseFrontmatterMetadata('# 그냥 글\n본문만 있음')).toBeNull();
  });

  it('title 또는 date가 없으면 null', () => {
    expect(parseFrontmatterMetadata(wrap(`title: 'T'`))).toBeNull();
  });

  it('isSeriesLanding: true를 인식하고 postId 없으면 id=seriesId', () => {
    const fm = parseFrontmatterMetadata(
      wrap(`title: '프론트엔드', seriesId: 'frontend', date: '2025-01-01 00:00', isSeriesLanding: true`),
    );
    expect(fm?.isSeriesLanding).toBe(true);
    expect(fm?.id).toBe('frontend');
  });

  it('중첩 객체가 있어도 괄호 깊이로 블록 끝을 찾는다', () => {
    const fm = parseFrontmatterMetadata(
      wrap(`title: 'T', date: '2026-01-01 00:00', nested: { a: { b: 1 } }`),
    );
    expect(fm?.title).toBe('T');
  });
});
