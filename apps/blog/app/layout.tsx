import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog';
import { Banner, Head, Search } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-blog/style.css';
import { PropsWithChildren } from 'react';
import { NextraTheme } from './_components/nextra-theme';

export const metadata = {
  title: 'Malloc72P',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const banner = (
    <Banner storageKey="4.0-release">
      🎉 Nextra 4.0 is released.{' '}
      <a href="#" className="x:text-primary-600">
        Read more →
      </a>
    </Banner>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
      <body>
        <NextraTheme pageMap={await getPageMap()}>{children}</NextraTheme>
      </body>
    </html>
  );
}
