import { MdxFileInfo } from '../mdx-utils';

/**
 * MdxFileInfo 픽스처를 만든다.
 *
 * getAllMdxFiles를 목킹하는 테스트들이 같은 모양의 가짜 파일 정보를 필요로 하므로 한 곳에 둔다.
 * MdxFileInfo에 필드가 추가되면 여기만 고치면 된다.
 */
export function mdxFile(slug: string, fm: Partial<MdxFileInfo['frontMatter']> = {}): MdxFileInfo {
  return {
    slug,
    route: `/posts/${slug}`,
    filePath: `/fake/${slug}`,
    frontMatter: { title: slug, date: '2026-01-01 00:00', ...fm },
  };
}
