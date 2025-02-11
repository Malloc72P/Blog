import { LoadingOverlayProvider } from '@components/loading-overlay-provider';
import { PageProgressBar } from '@components/navigation-progress-bar';
import { ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Inabase',
  description: 'Simple AppServer',
};

const theme = createTheme({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <LoadingOverlayProvider>{children}</LoadingOverlayProvider>
          <Notifications />
          <PageProgressBar />
        </MantineProvider>
      </body>
    </html>
  );
}
