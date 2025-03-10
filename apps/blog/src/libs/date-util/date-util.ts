import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import { DateFormat, IDateFormat } from './date-format';
import { PostModel } from '@libs/types/commons';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ko');

const CustomDayJS = dayjs;

const toLocalTime = (date: string | Date) => {
  return DateUtil.Dayjs(date).format(DateFormat.iso);
};

const format = (
  date: string | Date | dayjs.Dayjs,
  formatType: IDateFormat,
  applyTimezone: boolean = true
) => {
  let dayjsObj: dayjs.Dayjs = dayjs.isDayjs(date) ? date : CustomDayJS(date);

  if (applyTimezone) {
    dayjsObj = dayjsObj.tz(DateUtil.tzString.seoul);
  }

  const format = DateFormat[formatType];

  return dayjsObj.format(format);
};

export const DateUtil = {
  toLocalTime,
  format,
  Dayjs: (date?: string | Date) => CustomDayJS(date),
  now: () => DateUtil.Dayjs().tz(DateUtil.tzString.seoul),
  parseWithTimezone: (date?: string | Date, tz?: string) => dayjs.tz(date, tz).locale('ko'),
  tzString: {
    seoul: 'Asia/Seoul',
    toronto: 'America/Toronto',
  },
  postSorter: (a: PostModel, b: PostModel) => b.date.getTime() - a.date.getTime(),
};
