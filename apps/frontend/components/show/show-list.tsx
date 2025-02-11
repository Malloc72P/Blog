import { SimpleGrid } from '@mantine/core';
import { ShowDto } from '@repo/dto';
import { ShowListItemLoading, ShowListItem } from './show-list-item';

export interface ShowListProps {
  shows: ShowDto[];
  isShowLoading: boolean;
}

export function ShowList({ shows, isShowLoading }: ShowListProps) {
  return (
    <SimpleGrid
      spacing="lg"
      cols={{
        md: 3,
        sm: 1,
      }}
    >
      {isShowLoading ? (
        <ShowListLoading />
      ) : (
        shows.map((show) => <ShowListItem key={show.id} title={show.title} tags={show.tags} />)
      )}
    </SimpleGrid>
  );
}

export function ShowListLoading() {
  return (
    <>
      <ShowListItemLoading />
      <ShowListItemLoading />
      <ShowListItemLoading />
      <ShowListItemLoading />
      <ShowListItemLoading />
      <ShowListItemLoading />
    </>
  );
}
