import { TOC } from '@components/toc';
import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components';
import { ReactElement } from 'react';

const defaultComponents = getNextraComponents({
  wrapper({ children, toc }) {
    return (
      <>
        <div style={{ flexGrow: 1, padding: 20 }}>{children}</div>
        <TOC toc={toc} />
      </>
    );
  },
});

export const useMDXComponents = (components: ReactElement[]) => ({
  ...defaultComponents,
  ...components,
});
