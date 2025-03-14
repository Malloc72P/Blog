'use client';

import { IconChevronDown } from '@tabler/icons-react';
import classNames from 'classnames';
import { Html } from 'next/document';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface DropdownMenuItemProps {
  id: string;
  label: string;
  href: string;
}

export interface DropdownMenuProps {
  title: string;
  width?: number;
  items: DropdownMenuItemProps[];
}

const HIDE_TIMEOUT_LENGTH = 100;

export function DropdownMenu({ title, items, ...option }: DropdownMenuProps) {
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
  useEffect(() => {
    adjustOffsetX();

    window.addEventListener('resize', adjustOffsetX);

    return () => {
      window.removeEventListener('resize', adjustOffsetX);
    };
  }, []);

  useEffect(() => {
    const body = dropdownBodyRef.current;

    if (!body) {
      return;
    }

    let timeout: any = null;

    if (visible) {
      body.style.display = 'flex';
      timeout = setTimeout(() => {
        timeout && clearTimeout(timeout);
        body.style.opacity = '1';
      });
    } else {
      body.style.opacity = '0';
      timeout = setTimeout(() => {
        timeout && clearTimeout(timeout);
        body.style.display = 'none';
      }, 300);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [visible]);

  /* ------------------------------------------------------ */
  /* ### RENDER ###  */
  /* ------------------------------------------------------ */

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={() => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }

        setVisible(true);
      }}
      onPointerLeave={() => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }

        hideTimeoutRef.current = setTimeout(() => setVisible(false), HIDE_TIMEOUT_LENGTH);
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
          'absolute top-6 bg-gray-950 z-50 p-5 flex-col gap-5 transition-all duration-300',
          'hidden opacity-0 rounded-b-lg drop-shadow-2xl'
        )}
        style={{ width: option.width ?? '100%', left: offsetX }}
      >
        {/* ------------------------------------------------------ */}
        {/* DROPDOWN BODY ITEMS */}
        {/* ------------------------------------------------------ */}
        {items.map((item) => (
          <li
            key={item.id}
            className="hover:underline"
            onClick={() => {
              setVisible(false);
            }}
          >
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
