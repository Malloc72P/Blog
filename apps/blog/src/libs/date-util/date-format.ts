export type IDateFormat = 'long' | 'short' | 'file' | 'iso' | 'isoOffset' | 'postCard';

export const DateFormat: Record<IDateFormat, string> = {
  long: 'YYYY. MM. DD. dddd a h시 m분',
  short: 'YYYY-MM-DD',
  file: 'YYMMDD_HHmmss',
  iso: 'YYYY-MM-DDTHH:mm',
  // Schema.org 등 구조화 데이터가 기대하는 완전한 ISO 8601(초 + 타임존 오프셋 포함, 예: 2026-03-23T22:42:00+09:00)
  isoOffset: 'YYYY-MM-DDTHH:mm:ssZ',
  postCard: 'YYYY. MM. DD',
};
