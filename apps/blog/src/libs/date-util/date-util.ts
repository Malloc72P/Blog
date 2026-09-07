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
  const dayjsObj = dayjs.isDayjs(date) ? date : dayjs.tz(date, DateUtil.tzString.seoul);

  const pattern = DateFormat[formatType];
  const result = dayjsObj.format(pattern);

  return result;
};

/**
 * 날짜 문자열 두 개를 최신순(내림차순)으로 비교한다.
 *
 * 글 목록 정렬은 PostModel(date)과 MdxFileInfo(frontMatter.date) 양쪽에서 필요해,
 * 담는 객체가 아니라 날짜 문자열을 받는 형태로 둔다. 정렬 기준을 바꿀 일이 생기면 여기만 고친다.
 */
const compareDateDesc = (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();

/** 날짜 문자열 두 개를 오래된순(오름차순)으로 비교한다. */
const compareDateAsc = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();

export const DateUtil = {
  toLocalTime,
  format,
  Dayjs: (date?: string | Date) => CustomDayJS.tz(date, DateUtil.tzString.seoul),
  now: () => DateUtil.Dayjs().tz(DateUtil.tzString.seoul),
  tzString: {
    seoul: 'Asia/Seoul',
    toronto: 'America/Toronto',
  },
  compareDateDesc,
  compareDateAsc,
  postSorter: (a: PostModel, b: PostModel) => compareDateDesc(a.date, b.date),
  postSorterAsc: (a: PostModel, b: PostModel) => compareDateAsc(a.date, b.date),
};
