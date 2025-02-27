import { PostCard } from 'nextra-theme-blog';
import { getPosts, getTags } from '../../../libs/get-posts';
import Link from 'next/link';

export interface GenerateMetadataProps {
  params: any;
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const params = await props.params;
  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`,
  };
}

export async function generateStaticParams() {
  const allTags = await getTags();
  return [...new Set(allTags)].map((tag) => ({ tag }));
}

export interface TagPageProps {
  params: any;
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const { title } = await generateMetadata({ params });
  const posts = await getPosts();
  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter((post) => post.frontMatter.tags?.includes(decodeURIComponent(params.tag)))
        .map((post) => (
          <div key={post.route}>
            <Link href={post.route}>{post.name}</Link>
          </div>
        ))}
    </>
  );
}
