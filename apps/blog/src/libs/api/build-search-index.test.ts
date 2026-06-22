import { stripMdxToText } from '@libs/api/build-search-index';

describe('stripMdxToText', () => {
  it('frontmatter 호출/import/export 라인을 제거한다', () => {
    const raw = [
      `import { frontmatter } from '@libs/frontmatter';`,
      `export const metadata = frontmatter({ title: 'T', date: '2026-01-01 00:00' });`,
      ``,
      `본문 시작 문장.`,
    ].join('\n');

    const out = stripMdxToText(raw);
    expect(out).toContain('본문 시작 문장.');
    expect(out).not.toContain('frontmatter');
    expect(out).not.toContain('import');
  });

  it('코드 블록과 인라인 코드를 제거한다', () => {
    const raw = '앞 텍스트 ```ts\nconst secret = 1;\n``` 가운데 `inlineCode` 뒤 텍스트';
    const out = stripMdxToText(raw);
    expect(out).toContain('앞 텍스트');
    expect(out).toContain('뒤 텍스트');
    expect(out).not.toContain('secret');
    expect(out).not.toContain('inlineCode');
  });

  it('이미지는 alt, 링크는 표시 텍스트만 남긴다', () => {
    expect(stripMdxToText('![대체텍스트](/x.png)')).toContain('대체텍스트');

    const link = stripMdxToText('[링크표시](https://example.com)');
    expect(link).toContain('링크표시');
    expect(link).not.toContain('example.com');
  });

  it('본문 길이 상한(8000자)을 적용한다', () => {
    const out = stripMdxToText('가'.repeat(9000));
    expect(out.length).toBeLessThanOrEqual(8000);
  });
});
