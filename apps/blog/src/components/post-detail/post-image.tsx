import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

export interface PostImageProps {
  alt: string;
  src: string;
  // 마크다운 `![alt](src)` 문법으로 들어오는 이미지는 blur를 전달하지 않으므로 선택값으로 둔다.
  blur?: PlaceholderValue;
  // 기본은 lazy 로딩이다. 첫 화면(LCP)에 걸리는 이미지에만 명시적으로 옵트인한다.
  // 마크다운 문법 이미지는 위치 정보가 없으므로 무조건 priority를 걸면 하단 이미지까지
  // 즉시 preload되어 대역폭 경쟁으로 오히려 LCP가 늦어진다.
  priority?: boolean;
}

export function PostImage({ src, alt, blur, priority }: PostImageProps) {
  return (
    <span className="block text-center">
      <Image
        className="rounded-md mx-auto shadow-xl"
        src={src}
        alt={alt}
        placeholder={blur}
        width={600}
        height={400}
        // 고정 width/height 대비 표시폭이 달라져도 종횡비 경고가 나지 않도록 CSS로 비율을 유지한다.
        style={{ width: '100%', height: 'auto' }}
        // 본문 컨테이너(max-w-[1024px] + 좌우 패딩) 기준 실제 표시폭을 알려 과대 다운로드를 막는다.
        sizes="(max-width: 1024px) 100vw, 944px"
        priority={priority}
      />
      <span className="block text-gray-600 text-center leading-[28px] italic py-5 break-words">
        &quot;{alt}&quot;
      </span>
    </span>
  );
}
