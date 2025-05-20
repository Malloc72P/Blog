export interface SeriesModel {
  id: string;
  title: string;
  date: string;
}

export interface TagModel {
  id: string;
}

export interface PostModel {
  route: string;
  series: SeriesModel;
  title: string;
  tags: TagModel[];
  date: string;
  prevPost?: PostModel;
  nextPost?: PostModel;
}
