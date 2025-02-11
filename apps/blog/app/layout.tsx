import { NextraTheme } from '@components/nextra-theme';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { PropsWithChildren } from 'react';

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
