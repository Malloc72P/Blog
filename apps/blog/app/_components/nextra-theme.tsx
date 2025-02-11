import type { PageMapItem } from 'nextra';
import { version } from 'nextra/package.json';
import type { FC, ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Footer } from './footer';

export const NextraTheme: FC<{
  children: ReactNode;
  pageMap: PageMapItem[];
}> = ({ children, pageMap }) => {
  return (
    <>
      <h1
        style={{
          margin: 0,
          padding: 20,
          background: 'lightslategray',
          fontWeight: 'normal',
        }}
      >
        Custom theme demo for <strong>Nextra {version}</strong>
      </h1>
      <Navbar pageMap={pageMap} />
      <div style={{ display: 'flex' }}>
        <Sidebar pageMap={pageMap} />
        {children}
      </div>
      <Footer />
    </>
  );
};
