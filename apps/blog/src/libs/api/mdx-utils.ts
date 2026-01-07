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
 * MDX 파일에서 export const metadata 추출
 */
async function extractMetadata(filePath: string): Promise<MdxFileInfo['frontMatter'] | null> {
  const content = fs.readFileSync(filePath, 'utf-8');

  // export const metadata = { ... } 패턴 매칭
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});?\s*$/m);

  if (!metadataMatch) return null;

  try {
    // 안전하게 파싱 (eval 대신 Function 생성자 사용)
    const metadataStr = metadataMatch[1];
    const metadata = new Function(`return ${metadataStr}`)();
    return metadata;
  } catch (e) {
    console.error(`Failed to parse metadata from ${filePath}`, e);
    return null;
  }
}
