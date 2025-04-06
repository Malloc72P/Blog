'use client';

import { IconChevronDown } from '@tabler/icons-react';
import classNames from 'classnames';
import { Html } from 'next/document';
import Link from 'next/link';
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

const HIDE_TIMEOUT_LENGTH = 0;

export function DropdownMenu({ title, items, leftOffset = 0, ...option }: DropdownMenuProps) {
  /* ------------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------------ */
  const [visible, setVisible] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  /* ------------------------------------------------------ */
  /* REFS */
  /* ------------------------------------------------------ */
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownBodyRef = useRef<HTMLUListElement>(null);
  const hideTimeoutRef = useRef<any>(null);

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
  useLayoutEffect(() => {
    adjustOffsetX();

    window.addEventListener('resize', adjustOffsetX);

    return () => {
      window.removeEventListener('resize', adjustOffsetX);
    };
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
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              setVisible(false);
            }}
          >
            <Link
              href={item.href}
              className="block hover:underline p-3 w-full cursor-pointer rounded-md transition-all duration-300"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
