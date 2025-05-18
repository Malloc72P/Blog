import Image from 'next/image';
import Dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

Dayjs.extend(utc);
Dayjs.extend(timezone);

export default function Home() {
  const dateString = '2025-01-01T10:00:00+09:00';
  const date = new Date(dateString);
  const utcString = date.toUTCString();
  const parsedWithDefaultOption = Dayjs(date).format('YYYY-MM-DD HH:mm');
  const parsedWithTZ = Dayjs.tz(date, 'Asia/Seoul').format('YYYY-MM-DD HH:mm');

  return (
    <div className="relative p-10">
      <div className="mb-3">
        <h5>Date객체에 저장된 UTC 시간</h5>
        <span>{utcString}</span>
      </div>

      <div className="mb-3">
        <h5>기본 설정으로 DayJs 객체 생성.</h5>
        <span>{parsedWithDefaultOption}</span>
      </div>

      <div className="mb-3">
        <h5>타임존 지정하여 DayJs 객체 생성</h5>
        <span>{parsedWithTZ}</span>
      </div>
    </div>
  );
}
