'use client';

import { MainFooter } from '@components/main-footer';
import { MainHeader } from '@components/main-header';
import { AppShell } from '@mantine/core';
import { PropsWithChildren } from 'react';

export default function PublicClientLayout({ children }: PropsWithChildren) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <MainHeader />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Section>
        <MainFooter />
      </AppShell.Section>
    </AppShell>
  );
}
