import { MyHeader } from "@/components/my-header";
import classNames from "classnames";

export default function Home() {
  return (
    <section>
      <MyHeader
        descList={["회색 상자가 z index로 인해 빨간 상자보다 위에 배치됨."]}
      >
        예제1: z-index로 순서 변경되는 상황
      </MyHeader>

      <div className="relative">
        <div className="gray-box">
          <span
            className={classNames(
              "w-[100px] h-[100px]",
              "border bg-gray-400 leading-[100px] text-center",
              "absolute left-0 top-0",
              "z-[10]",
            )}
          >
            회색 상자
          </span>
        </div>

        <div className="gray-box">
          <span
            className={classNames(
              "w-[100px] h-[100px]",
              "border bg-red-700 leading-[100px] text-center",
              "absolute left-16 top-16",
            )}
          >
            빨간 상자
          </span>
        </div>
      </div>
    </section>
  );
}
