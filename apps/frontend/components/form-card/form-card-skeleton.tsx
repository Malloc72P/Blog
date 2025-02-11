import { Card, TextInput, Group, Button, Skeleton } from '@mantine/core';

export function FormLoading() {
  return (
    <Card p="lg" withBorder shadow="md">
      <Skeleton w="15%" h={33} />
      <Skeleton w="40%" h={25} my="sm" />

      <Skeleton w="30%" h={36} />
      <Group justify="end">
        <Skeleton w={62} h={34} />
      </Group>
    </Card>
  );
}
