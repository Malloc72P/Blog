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

  try {
    const pagePath = buildModulePath(filePath);

    // Webpack이 동적 import를 올바르게 분석할 수 있도록 alias(@app) 대신 상대 경로를 사용
    const pageMdx = await import(`../../app/${pagePath}`);

    return pageMdx.metadata;
  } catch (e) {
    console.error(`Failed to parse metadata from ${filePath}`, e);
    return null;
  }
}

function buildModulePath(filePath: string) {
  const postPartialPath = filePath.split('src/app/')[1];

  if (!postPartialPath) {
    throw new Error('Invalid file path');
  }

  const pagePath = postPartialPath.includes('.tsx')
    ? postPartialPath.replace('.tsx', '')
    : postPartialPath;
  return pagePath;
}
