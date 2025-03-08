export function IntroduceCard() {
  return (
    <div className="mt-[120px] rounded-md border flex relative shadow-md">
      {/* === INTRODUCE CARD LEFT Bar === */}
      <div className="w-[17px] h-full bg-gray-700  absolute left-0 top-0"></div>

      {/* === INTRODUCE CARD Right SECTION === */}
      <div className="flex flex-col pl-[46px] py-5 pr-[24px]">
        {/* === INTRODUCE CARD NAME AND ROLE === */}
        <div className="font-bold">
          <div className="text-[24px]">SeungChul Na. (Malloc72P)</div>
          <div className="text-gray-400">Frontend Developer</div>
        </div>

        {/* === INTRODUCE CARD DESCRIPTION ABOUT ME === */}
        <span className="text-gray-400 mt-4">
          환영합니다! 개발하면서 경험한 지식을 공유하기 위해 직접 디자인하고 개발한 블로그입니다.{' '}
          <br /> 많은 관심 부탁드립니다!
        </span>
      </div>
    </div>
  );
}
