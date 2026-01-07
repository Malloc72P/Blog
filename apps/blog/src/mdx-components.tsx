import type { MDXComponents } from 'mdx/types';
import { PostImage } from '@components/post-detail';
import { PostCodeblock } from '@components/post-detail/post-codeblock';
import { MdxWrapper } from '@components/mdx-wrapper';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: PostImage,
    pre: PostCodeblock,
    wrapper: MdxWrapper,
    ...components,
  };
}
