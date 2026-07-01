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

  it('frontmatter 호출이 없으면 던진다(#99: silent skip 금지)', () => {
    expect(() => parseFrontmatterMetadata('# 그냥 글\n본문만 있음')).toThrow(
      /frontmatter\(\{\.\.\.\}\) 블록을 찾을 수 없습니다/,
    );
  });

  it('title 또는 date가 없으면 던진다(#99: silent skip 금지)', () => {
    expect(() => parseFrontmatterMetadata(wrap(`title: 'T'`))).toThrow(
      /필수 필드\(title\/date\)가 없습니다/,
    );
  });

  it('에러 메시지에 파일 경로를 포함한다', () => {
    expect(() => parseFrontmatterMetadata('본문만', '/fake/page.mdx')).toThrow(/\/fake\/page\.mdx/);
  });

  it('큰따옴표로 감싼 값도 추출한다(#99: 따옴표 종류 보강)', () => {
    const fm = parseFrontmatterMetadata(wrap(`title: "큰따옴표 제목", date: "2026-01-01 00:00"`));
    expect(fm.title).toBe('큰따옴표 제목');
  });

  it('백틱으로 감싼 값도 추출한다(#99: 따옴표 종류 보강)', () => {
    const fm = parseFrontmatterMetadata(wrap('title: `백틱 제목`, date: `2026-01-01 00:00`'));
    expect(fm.title).toBe('백틱 제목');
  });

  it('isSeriesLanding: true를 인식하고 postId 없으면 id=seriesId', () => {
    const fm = parseFrontmatterMetadata(
      wrap(`title: '프론트엔드', seriesId: 'frontend', date: '2025-01-01 00:00', isSeriesLanding: true`),
    );
    expect(fm.isSeriesLanding).toBe(true);
    expect(fm.id).toBe('frontend');
  });

  it('중첩 객체가 있어도 괄호 깊이로 블록 끝을 찾는다', () => {
    const fm = parseFrontmatterMetadata(
      wrap(`title: 'T', date: '2026-01-01 00:00', nested: { a: { b: 1 } }`),
    );
    expect(fm.title).toBe('T');
  });
});
