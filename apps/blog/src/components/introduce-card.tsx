import classNames from 'classnames';

export function IntroduceCard() {
  // 데스크톱 첫 화면 밀도 확보를 위해 상단 마진을 md:mt-30(120px)에서 절반 수준(60px)으로 축소한다. 모바일(mt-7.5)은 유지.
  return (
    <div className="rounded-md border border-gray-100 flex relative shadow-md mt-7.5 md:mt-15 break-keep">
      {/* === INTRODUCE CARD LEFT Bar === */}
      <div className="w-2 md:w-4.25 h-full bg-gray-700  absolute left-0 top-0"></div>

      {/* === INTRODUCE CARD Right SECTION === */}
      <div className={classNames('flex flex-col', 'pl-5 py-4 pr-6', 'md:pl-11.5 md:py-5 md:pr-6')}>
        {/* === INTRODUCE CARD NAME AND ROLE === */}
        <div className="font-bold">
          <div className="text-[14px] md:text-[24px]">SeungChul Na. (Malloc72P)</div>
          <div className="text-[14px] md:text-[16px] text-gray-600">Frontend Developer</div>
        </div>

        {/* === INTRODUCE CARD DESCRIPTION ABOUT ME === */}
        {/* 모바일 가독성을 위해 본문 폰트를 10px에서 13px로 상향한다(데스크톱은 16px 유지). 하드코딩 <br /> 제거 후 break-keep 자동 줄바꿈에 맡긴다. */}
        <span className="text-gray-600 mt-4 text-[13px] md:text-[16px]">
          환영합니다! 개발하면서 경험한 지식을 공유하기 위해 직접 디자인하고 개발한 블로그입니다. 많은 관심 부탁드립니다!
        </span>
      </div>
    </div>
  );
}
