import { MyHeader } from "@/components/my-header";
import classNames from "classnames";

export default function Home() {
  return (
    <section>
      <MyHeader
        descList={[
          "position이 absolute | relative + z-index 값",
          "opacity < 1",
          "transform, filter, perspective, will-change, mix-blend-mode 등",
          "위 스타일이 적용된 요소가 새로운 Stacking Context의 루트가 된다.",
          "컨택스트 밖인 경우, 루트 요소끼리 z-index, DOM 순서로 비교하여 누가 앞에 올 지 정한다.",
          "컨택스트 안인 경우, 자식 끼리만 다시 z-index, DOM 순서로 비교한다.",
          "컨택스트가 다른 경우, 자식간의 z-index는 서로 영향을 주지 않는다.",
        ]}
      >
        예제3: Stacking Context를 새로 만드는 방법
      </MyHeader>

      <div className="relative h-[220px]">
        <div
          className={classNames(
            "gray-box",
            /**
             * 아래의 속성은 랜더링 결과에 큰 영향을 주지 않으면서도
             * 해당 div를 새로운 Stacking Context의 루트로 만든다.
             *
             * 추천하는건 isolate이다.
             * https://developer.mozilla.org/ko/docs/Web/CSS/isolation
             * 새로운 Stacking Context를 생성해야 하는지를 지정하는 속성이다.
             */
            "isolate",
            // "translate-z-0",
            // "scale-100",
            // "relative z-0",
          )}
        >
          <span
            className={classNames(
              "w-[120px] h-[120px]",
              "border bg-gray-400 leading-[120px] text-center",
              "absolute left-0 top-0",
              "z-10",
            )}
          >
            회색 상자(z-10)
          </span>
        </div>

        <div className="red-box">
          <span
            className={classNames(
              "w-[120px] h-[120px]",
              "border bg-red-700 leading-[120px] text-center",
              "absolute left-20 top-20",
            )}
          >
            빨간 상자(z-0)
          </span>
        </div>
      </div>
    </section>
  );
}
