import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

export interface PostImageProps {
  alt: string;
  src: string;
  // 마크다운 `![alt](src)` 문법으로 들어오는 이미지는 blur를 전달하지 않으므로 선택값으로 둔다.
  blur?: PlaceholderValue;
}

export function PostImage({ src, alt, blur }: PostImageProps) {
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
        priority
      />
      <span className="block text-gray-600 text-center leading-[28px] italic py-5 break-words">
        "{alt}"
      </span>
    </span>
  );
}
