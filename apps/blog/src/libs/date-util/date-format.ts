export type IDateFormat = 'long' | 'short' | 'file' | 'iso';

export const DateFormat: Record<IDateFormat, string> = {
  long: 'YYYY-MM-DD HH시 mm분 ss초',
  short: 'YYYY-MM-DD',
  file: 'YYMMDD_HHmmss',
  iso: 'YYYY-MM-DDTHH:mm',
};
