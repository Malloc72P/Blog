'use client';

import { ShowList } from '@components/show';
import { useShow } from '@hooks/use-shows';
import { Container } from '@mantine/core';

export default function MainPage() {
  const { shows, isShowLoading } = useShow();

  return (
    <Container>
      <ShowList shows={shows} isShowLoading={isShowLoading} />
    </Container>
  );
}
