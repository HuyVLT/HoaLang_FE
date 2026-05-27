'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface OrnamentDividerProps {
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * OrnamentDivider - An elegant editorial centered separator containing diamond elements.
 * Follows the "◆ ─────── ◆" design standard in stone color.
 */
export default function OrnamentDivider({ className }: OrnamentDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full py-8 text-stone select-none",
        className
      )}
      role="separator"
    >
      <svg
        width="280"
        height="20"
        viewBox="0 0 280 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-4 max-w-full text-stone"
      >
        {/* Left Diamond '◆' */}
        <rect
          x="10"
          y="10"
          width="6"
          height="6"
          transform="rotate(45 10 10)"
          fill="currentColor"
        />

        {/* Connecting Line Left */}
        <line
          x1="22"
          y1="10"
          x2="130"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        {/* Center Accent Diamond '◆' */}
        <rect
          x="140"
          y="10"
          width="4"
          height="4"
          transform="rotate(45 140 10)"
          fill="currentColor"
          className="opacity-70"
        />

        {/* Connecting Line Right */}
        <line
          x1="150"
          y1="10"
          x2="258"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        {/* Right Diamond '◆' */}
        <rect
          x="270"
          y="10"
          width="6"
          height="6"
          transform="rotate(45 270 10)"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export { OrnamentDivider };
