import fs from 'fs';
import { findPosts } from './find-posts';
import { SearchDoc } from '@libs/types/search';

// 인덱스 크기를 제한하기 위한 본문 길이 상한(문자 수)
const CONTENT_CHAR_LIMIT = 8000;

/**
 * MDX/TSX 본문에서 검색에 사용할 평문 텍스트만 추출한다.
 * (frontmatter, import/export, 코드 블록, JSX 태그, 마크다운 기호 제거)
 */
function extractPlainText(filePath: string): string {
  let raw: string;
  try {
    // 파일 본문을 통째로 읽는다
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    // 읽기 실패 시 본문 없이 처리(메타데이터만으로도 검색 가능)
    return '';
  }

  // 1) frontmatter({ ... }) 메타데이터 호출 블록을 괄호 짝을 세어 통째로 제거
  const metaStart = raw.indexOf('frontmatter(');
  if (metaStart !== -1) {
    let depth = 0; // 괄호 깊이
    let i = metaStart + 'frontmatter'.length; // 첫 '(' 위치
    for (; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '(') depth++; // 여는 괄호를 만나면 깊이 증가
      else if (ch === ')') {
        depth--; // 닫는 괄호를 만나면 깊이 감소
        if (depth === 0) {
          i++; // 닫는 괄호 다음 위치까지 포함해 잘라낸다
          break;
        }
      }
    }
    // frontmatter(...) 호출 부분을 앞/뒤로 잘라 제거
    raw = raw.slice(0, metaStart) + raw.slice(i);
  }

  return (
    raw
      // import 구문 제거
      .replace(/^import\s.+$/gm, ' ')
      // export 구문 제거(메타데이터 잔여 라인 포함)
      .replace(/^export\s.+$/gm, ' ')
      // 펜스 코드 블록 제거
      .replace(/```[\s\S]*?```/g, ' ')
      // 인라인 코드 제거
      .replace(/`[^`]*`/g, ' ')
      // 이미지: alt 텍스트만 남김
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
      // 링크: 표시 텍스트만 남김
      .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
      // JSX/HTML 태그 제거
      .replace(/<[^>]+>/g, ' ')
      // 마크다운 기호 제거
      .replace(/[#>*_~`|]/g, ' ')
      // 연속 공백을 하나로 정규화
      .replace(/\s+/g, ' ')
      .trim()
      // 인덱스 크기 상한 적용
      .slice(0, CONTENT_CHAR_LIMIT)
  );
}

/**
 * 모든 포스트를 검색 문서(SearchDoc)로 변환한다.
 * 빌드 타임(서버)에서만 실행되며, 결과는 정적 JSON으로 제공된다.
 */
export async function buildSearchIndex(): Promise<SearchDoc[]> {
  // findPosts는 시리즈 랜딩 페이지를 제외한 실제 포스트만 반환한다
  const posts = await findPosts({ orderBy: 'latest' });

  return posts.map((post) => {
    const fm = post.frontMatter;
    return {
      id: fm.id ?? post.slug,
      title: fm.title,
      description: fm.description ?? '',
      series: fm.series ?? '',
      tags: fm.tags ?? [],
      route: post.route,
      content: extractPlainText(post.filePath),
    };
  });
}
