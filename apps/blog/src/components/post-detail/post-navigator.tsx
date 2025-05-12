import { PageLinkMap } from '@libs/page-link-map';
import { PostModel } from '@libs/types/commons';
import { IconSquareChevronLeft, IconSquareChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

export interface PostNavigatorProps {
  mode: 'prev' | 'next';
  post: PostModel;
}

export function PostNavigator({ mode, post }: PostNavigatorProps) {
  return (
    <Link
      href={post.route}
      className={classNames(
        'group/navigator',
        'flex bg-gray-50 p-3 rounded-md gap-3 items-center grow basis-0 min-w-0 cursor-pointer',
        mode === 'prev' ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* ------------------------------------------------------ */}
      {/* LEFT ICON */}
      {/* ------------------------------------------------------ */}
      <div>
        {mode === 'prev' ? (
          <IconSquareChevronLeft className="w-10 h-10 stroke-1 text-gray-400" />
        ) : (
          <IconSquareChevronRight className="w-10 h-10 stroke-1 text-gray-400" />
        )}
      </div>

      {/* ------------------------------------------------------ */}
      {/* RIGHT SECTION */}
      {/* ------------------------------------------------------ */}
      <div className="flex flex-col gap-3 min-w-0">
        <span className="text-xs">{mode === 'prev' ? '이전 포스트' : '다음 포스트'}</span>
        <span
          className={classNames(
            'font-bold w-full overflow-hidden whitespace-nowrap text-ellipsis',
            'group-hover/navigator:underline'
          )}
        >
          {post.title}
        </span>
      </div>
    </Link>
  );
}

export function PostNavigatorPlaceholder() {
  return <div className="grow basis-0 min-w-0"></div>;
}
