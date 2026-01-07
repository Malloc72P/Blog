import { getAllMdxFiles } from './mdx-utils';

export async function findTags(): Promise<string[]> {
  const allFiles = await getAllMdxFiles();
  const tags = new Set<string>();

  allFiles.forEach((file) => {
    file.frontMatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}
