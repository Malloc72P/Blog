import classNames from 'classnames';

export function IntroduceCard() {
  return (
    <div className="rounded-md border flex relative shadow-md mt-[30px] md:mt-[120px] break-keep">
      {/* === INTRODUCE CARD LEFT Bar === */}
      <div className="w-[8px] md:w-[17px] h-full bg-gray-700  absolute left-0 top-0"></div>

      {/* === INTRODUCE CARD Right SECTION === */}
      <div
        className={classNames(
          'flex flex-col',
          'pl-[20px] py-4 pr-[24px]',
          'md:pl-[46px] md:py-5 md:pr-[24px]'
        )}
      >
        {/* === INTRODUCE CARD NAME AND ROLE === */}
        <div className="font-bold">
          <div className="text-[14px] md:text-[24px]">SeungChul Na. (Malloc72P)</div>
          <div className="text-[14px] md:text-[16px] text-gray-400">Frontend Developer</div>
        </div>

        {/* === INTRODUCE CARD DESCRIPTION ABOUT ME === */}
        <span className="text-gray-400 mt-4 text-[10px] md:text-[16px]">
          환영합니다! 개발하면서 경험한 지식을 공유하기 위해 직접 디자인하고 개발한 블로그입니다.{' '}
          <br /> 많은 관심 부탁드립니다!
        </span>
      </div>
    </div>
  );
}
