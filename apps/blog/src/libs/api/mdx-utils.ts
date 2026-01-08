import fs from 'fs';
import dynamic from 'next/dynamic';
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

  async function scanDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name === 'page.mdx' || entry.name === 'page.tsx') {
        const metadata = await extractMetadata(fullPath);
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

  await scanDir(dir);
  return files;
}

/**
 * MDX 파일에서 export const metadata 추출 (Nested Object 지원)
 */
async function extractMetadata(filePath: string): Promise<MdxFileInfo['frontMatter'] | null> {
  const content = fs.readFileSync(filePath, 'utf-8');

  // export const metadata = 까지 찾기
  const startRegex = /export\s+const\s+metadata\s*=\s*/;
  const match = content.match(startRegex);

  if (!match || match.index === undefined) return null;

  const startIndex = match.index + match[0].length;
  let objectEndIndex = -1;
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false; // // comment
  let started = false;

  // 단순 파서: 중괄호 균형 맞추기
  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1] || '';

    // 메타데이터 객체 시작 찾기
    if (!started) {
      if (char === '{') {
        started = true;
        braceCount++;
      }
      continue;
    }

    // 주석 처리 (// 만 고려 - MDX/TS 메타데이터 블록 내에서는 보통 한줄 주석만 사용됨)
    // 복잡성을 줄이기 위해 단순화. 메타데이터 객체 내부에 복잡한 코드가 없다고 가정.
    if (!inString && char === '/' && nextChar === '/') {
      inComment = true;
      i++;
      continue;
    }
    if (inComment) {
      if (char === '\n') {
        inComment = false;
      }
      continue;
    }

    // 문자열 처리
    if (!inComment) {
      if (inString) {
        if (char === stringChar && content[i - 1] !== '\\') {
          inString = false;
        }
      } else {
        if (char === "'" || char === '"' || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            objectEndIndex = i + 1;
            break;
          }
        }
      }
    }
  }

  if (objectEndIndex === -1) return null;

  const metadataStr = content.substring(startIndex, objectEndIndex).trim();

  try {
    // 안전하게 파싱 (eval 대신 Function 생성자 사용)
    const metadata = new Function(`return ${metadataStr}`)();
    return metadata;
  } catch (e) {
    console.error(`Failed to parse metadata from ${filePath}`, e);
    return null;
  }
}
