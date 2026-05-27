'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionLabelProps {
  /**
   * The text label to display
   */
  label: string;
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * SectionLabel - An elegant, traditional uppercase label with a gold prefix line.
 * Used consistently before major section headings across the platform.
 */
export default function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold font-sans select-none",
        className
      )}
    >
      {/* 32px gold prefix line */}
      <span className="w-8 h-[1px] bg-gold block shrink-0 opacity-80" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export { SectionLabel };
