import { PostCard } from 'nextra-theme-blog';
import { getPosts } from '../../../libs/api/get-posts';
import Link from 'next/link';
import { getTags } from '@libs/api/get-tags';

export interface GenerateMetadataProps {
  params: any;
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const params = await props.params;
  return {
    title: `Posts of “${decodeURIComponent(params.series)}” Series`,
  };
}

export async function generateStaticParams() {
  const allTags = await getTags();
  return [...new Set(allTags)].map((tag) => ({ tag }));
}

export interface SeriesPageProps {
  params: any;
}

export default async function SeriesPage(props: SeriesPageProps) {
  const params = await props.params;
  const { title } = await generateMetadata({ params });
  const posts = await getPosts();
  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter((post) => post.frontMatter.series === decodeURIComponent(params.series))
        .map((post) => (
          <div key={post.route}>
            <Link href={post.route}>{post.name}</Link>
          </div>
        ))}
    </>
  );
}
