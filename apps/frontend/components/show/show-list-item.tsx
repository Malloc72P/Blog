import { cn } from '@libs/ui';
import { Card, Group, Skeleton, Badge, Text, Flex, Button } from '@mantine/core';
import classes from './show-list-item.module.css';

export interface ShowListItemProps {
  title: string;
  tags?: string[];
}

const SHOW_LIST_ITEM_WIDTH = 320;

export function ShowListItemLoading() {
  return (
    <Card
      className={cn('show-list-item-skeleton', classes.show)}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Flex justify="space-between" direction="column" gap="xs">
        <Skeleton w="100%" h={20} />
        <Skeleton w={50} h={20} />
      </Flex>
    </Card>
  );
}

export function ShowListItem({ title, tags = [] }: ShowListItemProps) {
  return (
    <Card
      className={cn('show-list-item', classes.show)}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Flex justify="space-between" direction="column" gap="xs">
        <Text fw="bold">{title}</Text>
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </Flex>
    </Card>
  );
}
