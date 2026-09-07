import { PageLinkMap } from './page-link-map';
import { SeriesModel, TagModel } from './types/commons';

/**
 * 헤더 드롭다운·푸터·모바일 사이드바가 공유하는 내비게이션 항목.
 * 세 곳이 같은 모양을 각자 선언하지 않도록 한 곳에 둔다.
 */
export interface NavItemModel {
  id: string;
  label: string;
  href: string;
}

/**
 * 시리즈 목록을 내비게이션 항목으로 바꾼다.
 *
 * 헤더·푸터·사이드바가 모두 같은 시리즈 링크를 노출하므로, 라벨과 경로를 만드는 규칙을
 * 한 곳에 모아 셋이 어긋나지 않게 한다.
 */
export function toSeriesNavItems(seriesList: SeriesModel[]): NavItemModel[] {
  return seriesList.map((series) => ({
    id: series.id,
    label: series.title,
    href: PageLinkMap.series.landing(series.id),
  }));
}

/** 태그 목록을 내비게이션 항목으로 바꾼다. */
export function toTagNavItems(tags: TagModel[]): NavItemModel[] {
  return tags.map((tag) => ({
    id: tag.id,
    label: tag.id,
    href: PageLinkMap.tags.landing(tag.id),
  }));
}
