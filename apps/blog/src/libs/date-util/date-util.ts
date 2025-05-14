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

/**
 * 날짜에 포맷을 지정해서 문자열을 반환함.
 *
 * @param date 날짜 객체. Date 타입인 경우 내부에서 DayJs객체로 재생성함. 이 때 타임존이 서울로 강제 지정됨.
 * @param formatType 포맷 문자열
 * @returns 포맷 문자열에 맞게 출력된 날짜 문자열
 */
const format = (date: string | Date | dayjs.Dayjs, formatType: IDateFormat) => {
  let dayjsObj: dayjs.Dayjs = dayjs.isDayjs(date)
    ? date
    : CustomDayJS.tz(date, DateUtil.tzString.seoul);

  const format = DateFormat[formatType];
  const result = dayjsObj.format(format);

  return result;
};

export const DateUtil = {
  toLocalTime,
  format,
  Dayjs: (date?: string | Date) => CustomDayJS.tz(date, DateUtil.tzString.seoul),
  now: () => DateUtil.Dayjs().tz(DateUtil.tzString.seoul),
  tzString: {
    seoul: 'Asia/Seoul',
    toronto: 'America/Toronto',
  },
  postSorter: (a: PostModel, b: PostModel) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
};
