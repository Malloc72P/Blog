import { MyHeader } from "@/components/my-header";
import classNames from "classnames";

export default function Home() {
  return (
    <section>
      <MyHeader
        descList={[
          "회색 상자가 z index로 인해 빨간 상자보다 위에 배치될 것이라고 예상한 상황.",
          "하지만 회색상자에 부여한 opacity로 인해, 빨간 상자가 더 위에 올라오게 됨",
        ]}
      >
        예제2: z-index가 낮은 요소가 더 위에 올라옴
      </MyHeader>

      <div className="relative">
        <div
          className={classNames(
            "gray-box",
            /**
             * opacity 값이 바뀌었으므로,
             * 해당 요소의 하위 요소는 새로운 Stacking Context에 배치된다.
             * 그러므로 그 안의 요소에 z-index를 줘도, 같은 Context 안에서만 비교된다.
             * 다른 Context에 있는 요소와 비교되지 않는다.
             * 따라서 회색상자의 span은 z-index가 있음에도 불구하고 빨강상자보다 아래에 그려지게 된다.
             */
            "opacity-60",
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
