import fs from 'fs';
import path from 'path';

export interface MdxFileInfo {
  slug: string;
  route: string;
  filePath: string;
  frontMatter: {
    title: string;
    description?: string;
    series?: string;
    tags?: string[];
    date: string;
    isSeriesLanding?: boolean;
    id?: string;
  };
}

const POSTS_DIR = path.join(process.cwd(), 'src/app/(main)/posts');

/**
 * 모든 MDX/TSX 파일을 재귀적으로 스캔하여 메타데이터를 수집
 */
export async function getAllMdxFiles(dir: string = POSTS_DIR): Promise<MdxFileInfo[]> {
  const files: MdxFileInfo[] = [];

  function scanDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name === 'page.mdx' || entry.name === 'page.tsx') {
        // 파싱 실패는 extractMetadata가 던지며, 여기서 잡지 않고 그대로 전파해
        // 빌드를 실패시킨다(포스트가 조용히 목록에서 사라지는 것을 방지, #99).
        const relativePath = path.relative(POSTS_DIR, currentDir);
        const metadata = extractMetadata(fullPath);
        files.push({
          slug: relativePath,
          route: `/posts/${relativePath}`,
          filePath: fullPath,
          frontMatter: metadata,
        });
      }
    }
  }

  scanDir(dir);

  return files;
}

/**
 * 파일 텍스트에서 frontmatter({...}) 블록을 파싱하여 메타데이터를 추출
 * 동적 import 대신 정적 파일 읽기를 사용하여 Turbopack 호환성을 확보
 * fs 읽기 실패·파싱 실패는 여기서 삼키지 않고 그대로 던진다(#99).
 */
function extractMetadata(filePath: string): MdxFileInfo['frontMatter'] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatterMetadata(content, filePath);
}

/**
 * 파일 본문 문자열에서 frontmatter({ ... }) 블록을 파싱해 메타데이터를 추출한다.
 * fs 접근과 분리된 순수 함수라 단위 테스트가 용이하다.
 * 블록을 못 찾거나 필수 필드(title/date)가 없으면 던진다 — 포스트가 빌드 성공인 채로
 * 목록에서 조용히 누락되는 것을 막기 위해서다(#99, silent skip 금지).
 */
export function parseFrontmatterMetadata(
  content: string,
  filePath = '(알 수 없는 파일)',
): MdxFileInfo['frontMatter'] {
  const startMarker = 'frontmatter({';
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error(`frontmatter({...}) 블록을 찾을 수 없습니다: ${filePath}`);
  }

  const blockStart = startIndex + startMarker.length;
  let depth = 1;
  let blockEnd = blockStart;

  while (blockEnd < content.length && depth > 0) {
    const char = content[blockEnd];
    if (char === '{') depth++;
    else if (char === '}') depth--;
    if (depth > 0) blockEnd++;
  }

  const body = content.slice(blockStart, blockEnd);

  const title = extractStringField(body, 'title');
  const date = extractStringField(body, 'date');

  if (!title || !date) {
    throw new Error(`frontmatter에 필수 필드(title/date)가 없습니다: ${filePath}`);
  }

  const description = extractStringField(body, 'description') ?? undefined;
  const seriesId = extractStringField(body, 'seriesId') ?? undefined;
  const postId = extractStringField(body, 'postId') ?? undefined;
  const tags = extractArrayField(body, 'tags');
  const isSeriesLanding = /isSeriesLanding:\s*true/.test(body) ? true : undefined;

  return {
    title,
    description,
    series: seriesId,
    tags: tags.length > 0 ? tags : undefined,
    date,
    isSeriesLanding,
    id: postId ?? seriesId,
  };
}

// 작은따옴표/큰따옴표/백틱 중 어떤 것으로 감싸도 값을 추출한다(#99: 따옴표 종류 보강).
// 값 내부에 이스케이프된 같은 종류 따옴표(예: "it's")가 있으면 그 지점에서 잘린다.
// 정규식 파서의 알려진 한계이며, 현재 실제 frontmatter 값에는 해당 사례가 없어 의도적으로 다루지 않는다.
function extractStringField(body: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*(['"\`])([^'"\`]*)\\1`);
  return body.match(regex)?.[2] ?? null;
}

function extractArrayField(body: string, field: string): string[] {
  const match = body.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
  const arrayContent = match?.[1];
  if (!arrayContent) return [];
  return (arrayContent.match(/['"`][^'"`]*['"`]/g) ?? []).map((item) => item.slice(1, -1));
}
