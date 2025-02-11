'use client';

import { AccountNameForm } from '@components/account-setting';
import { Container } from '@mantine/core';
import { ProfileContext } from 'app/providers/auth-session-provider';
import { useContext } from 'react';

export default function Page() {
  const { profile } = useContext(ProfileContext);

  return (
    <Container>
      <AccountNameForm profile={profile} />
    </Container>
  );
}
