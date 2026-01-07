import { SeriesModel, PostModel } from '@libs/types/commons';
import { useContext, useMemo } from 'react';
import { MainLayoutContext } from 'src/app/(main)/main-client-layout';

export interface UseSeriesProps {
  seriesId?: string;
}

export function useSeries({ seriesId }: UseSeriesProps) {
  const { seriesList } = useContext(MainLayoutContext);

  const series = useMemo<SeriesModel | null>(() => {
    return seriesList.find((s) => s.id === seriesId) || null;
  }, [seriesList, seriesId]);

  return series;
}

export interface UsePostProps {
  postId?: string;
}

export function usePost({ postId }: UsePostProps) {
  const { posts } = useContext(MainLayoutContext);

  const post = useMemo<PostModel | null>(() => {
    return posts.find((p) => p.id === postId) || null;
  }, [posts, postId]);

  return post;
}
