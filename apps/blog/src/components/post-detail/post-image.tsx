import classNames from 'classnames';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

export interface PostImageProps {
  alt: string;
  src: string;
  blur: PlaceholderValue;
}

export function PostImage(props: any) {
  const { src, alt, blur } = props as PostImageProps;
  console.log(props);
  return (
    <span className="block px-5 text-center">
      <Image className="mx-auto" src={src} alt={alt} placeholder={blur} priority />
      <span className="block text-gray-400 text-center leading-[28px] italic py-5 break-words">
        "{alt}"
      </span>
    </span>
  );
}
