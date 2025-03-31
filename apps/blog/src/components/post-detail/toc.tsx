'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { Heading } from 'nextra';

export interface TocProps {
  toc: Heading[];
  activeId: string;
}

export function Toc({ toc, activeId }: TocProps) {
  const router = useRouter();

  console.log(toc);

  return (
    <div className="w-[320px] mt-[200px]">
      <ol className="flex flex-col gap-4 p-4 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              console.log(item.id);
              //   router.push(item.id);
            }}
            className={classNames(
              'hover:cursor-pointer hover:underline list-decimal',
              item.id === activeId ? 'opacity-100' : 'opacity-30 hover:opacity-50'
            )}
          >
            {item.value}
          </li>
        ))}
      </ol>
    </div>
  );
}
