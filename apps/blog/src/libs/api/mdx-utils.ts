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
        const metadata = extractMetadata(fullPath);
        if (metadata) {
          const relativePath = path.relative(POSTS_DIR, currentDir);
          files.push({
            slug: relativePath,
            route: `/posts/${relativePath}`,
            filePath: fullPath,
            frontMatter: metadata,
          });
        }
      }
    }
  }

  scanDir(dir);

  return files;
}

/**
 * 파일 텍스트에서 frontmatter({...}) 블록을 파싱하여 메타데이터를 추출
 * 동적 import 대신 정적 파일 읽기를 사용하여 Turbopack 호환성을 확보
 */
function extractMetadata(filePath: string): MdxFileInfo['frontMatter'] | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const startMarker = 'frontmatter({';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return null;

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

    if (!title || !date) return null;

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
  } catch (e) {
    console.error(`Failed to parse metadata from ${filePath}`, e);
    return null;
  }
}

function extractStringField(body: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*'([^']*)'`);
  return body.match(regex)?.[1] ?? null;
}

function extractArrayField(body: string, field: string): string[] {
  const match = body.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
  const arrayContent = match?.[1];
  if (!arrayContent) return [];
  return (arrayContent.match(/'([^']*)'/g) ?? []).map((item) => item.slice(1, -1));
}
