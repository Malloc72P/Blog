'use client';

import { IconChevronDown } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface DropdownMenuItemProps {
  id: string;
  label: string;
  href: string;
}

export interface DropdownMenuProps {
  title: string;
  width?: number;
  items: DropdownMenuItemProps[];
  leftOffset?: number;
}

export function DropdownMenu({ title, items, leftOffset = 0, ...option }: DropdownMenuProps) {
  /* ------------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------------ */
  const [visible, setVisible] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  // 현재 경로를 읽어 드롭다운 항목 중 활성 시리즈를 강조한다.
  const pathname = usePathname();

  /* ------------------------------------------------------ */
  /* REFS */
  /* ------------------------------------------------------ */
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownBodyRef = useRef<HTMLUListElement>(null);

  /* ------------------------------------------------------ */
  /* FUNCTIONS */
  /* ------------------------------------------------------ */
  const adjustOffsetX = () => {
    if (!rootRef.current || !dropdownBodyRef.current) {
      return;
    }

    const root = rootRef.current;
    const dropdownBody = dropdownBodyRef.current;
    const rightBoundary = document.querySelector('html')?.getBoundingClientRect().right ?? Infinity;
    const offsetLeft = root.offsetLeft;
    const tolerance = 0;
    const rightEdge = offsetLeft + (option.width || dropdownBody.offsetWidth) + tolerance;

    if (rightEdge > rightBoundary) {
      setOffsetX(-(rightEdge - rightBoundary));
    } else {
      setOffsetX(0);
    }
  };

  /* ------------------------------------------------------ */
  /* EFFECTS */
  /* ------------------------------------------------------ */
  // 마운트 시 1회 위치 보정 + resize 리스너 등록만 수행한다.
  // adjustOffsetX는 매 렌더마다 새로 생성되므로 의존성에 넣으면 리스너가 반복 재등록되어
  // 동작이 바뀐다. 최신 ref/state를 클로저로 읽으므로 빈 배열로 1회만 실행한다.
  useLayoutEffect(() => {
    adjustOffsetX();

    window.addEventListener('resize', adjustOffsetX);

    return () => {
      window.removeEventListener('resize', adjustOffsetX);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const handler = (e: MouseEvent) => {
      if (rootRef.current && rootRef.current.contains(e.target as HTMLElement)) {
        return;
      }

      setVisible(false);
    };

    document.body.addEventListener('click', handler);

    return () => {
      document.body.removeEventListener('click', handler);
    };
  }, []);

  /* ------------------------------------------------------ */
  /* ### RENDER ###  */
  /* ------------------------------------------------------ */

  return (
    <div
      ref={rootRef}
      className="relative"
      onClick={() => {
        setVisible((prev) => !prev);
      }}
    >
      {/* ------------------------------------------------------ */}
      {/* DROPDOWN TRIGGER */}
      {/* ------------------------------------------------------ */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        {title}
        <IconChevronDown
          className="w-5 h-5 transition-all duration-500"
          style={{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </div>

      {/* ------------------------------------------------------ */}
      {/* DROPDOWN BODY */}
      {/* ------------------------------------------------------ */}
      <ul
        ref={dropdownBodyRef}
        className={classNames(
          'absolute top-6 bg-gray-950 z-50 px-2 py-4 flex-col transition-all duration-300',
          'rounded-b-lg drop-shadow-2xl',
          visible ? 'block' : 'hidden'
        )}
        style={{ width: option.width ?? '100%', left: offsetX + leftOffset }}
      >
        {/* ------------------------------------------------------ */}
        {/* DROPDOWN BODY ITEMS */}
        {/* ------------------------------------------------------ */}
        {items.map((item) => {
          // href가 현재 경로와 정확히 일치하면 활성 항목으로 표시한다.
          const active = item.href === pathname;

          return (
            <li
              key={item.id}
              onClick={() => {
                setVisible(false);
              }}
            >
              <Link
                href={item.href}
                // 활성 항목은 스크린리더가 현재 위치를 인지하도록 aria-current를 부여한다.
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  'block hover:underline p-3 w-full cursor-pointer rounded-md transition-all duration-300',
                  // 활성 항목은 굵게 + 밑줄로 강조한다.
                  active && 'font-bold underline',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
