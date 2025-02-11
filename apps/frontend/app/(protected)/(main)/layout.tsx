'use client';

import { PROTECTED_HEADER_HEIGHT, ProtectedHeader } from '@components/main-header';
import { useMainNavbarModel } from '@components/main-navbar';
import { AppShell, Box } from '@mantine/core';
import { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
  const navbarModel = useMainNavbarModel();

  return (
    <AppShell header={{ height: PROTECTED_HEADER_HEIGHT }}>
      <AppShell.Header withBorder={false}>
        <ProtectedHeader navbarModel={navbarModel} />
      </AppShell.Header>

      <AppShell.Main>
        <Box pt={42}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
