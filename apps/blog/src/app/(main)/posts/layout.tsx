import { PropsWithChildren } from 'react';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * 추가적인 메타데이터를 주입하는 함수
 * @returns 메타 정보(메타태그로 변환됨)
 */
export async function generateMetadata(props: Props) {
  //   console.log('generateMetadata', { props });
  //   debugger;
  console.log('ping');

  return {
    keywords: 'Holy Lonely Light',
  };
}

/**
 * 오직 메타데이터 생성을 위해 정의한 레이아웃 파일.
 * 따라서 아무것도 건드리지 않고 그대로 반환함
 */
export default function layout({ children }: PropsWithChildren) {
  return children;
}
