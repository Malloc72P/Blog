import { MyLink } from "@/components/my-link";
import { MyHeader } from "@/components/my-header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <MyHeader>z-index와 stacking context 예제</MyHeader>

      <ul className="list-disc pl-5 space-y-2">
        <li>
          <MyLink href="/ex1">예제1: z-index로 순서 변경되는 상황</MyLink>
        </li>
        <li>
          <MyLink href="/ex2">
            예제2: z-index가 낮은 요소가 더 위에 올라옴
          </MyLink>
        </li>
        <li>
          <MyLink href="/ex3">
            예제3: Stacking Context를 새로 만드는 방법
          </MyLink>
        </li>
      </ul>
    </div>
  );
}
