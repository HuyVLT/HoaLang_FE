'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TagBadgeProps {
  /**
   * The text label inside the badge/chip
   */
  label: string;
  /**
   * Design variant style.
   * - 'gold': turmeric highlights (default)
   * - 'stone': muted earthy tones
   * - 'lacquer': red lacquer accents
   */
  variant?: 'gold' | 'stone' | 'lacquer';
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * TagBadge - A premium, uppercase tag/chip component.
 * Uses strict border radiuses (2px) and opacity-based backgrounds in line with UI rules.
 */
export default function TagBadge({
  label,
  variant = 'gold',
  className,
}: TagBadgeProps) {
  // Styles mapping based on variant
  const stylesMap = {
    gold: 'border border-gold/40 bg-gold-20 text-gold',
    stone: 'border border-stone bg-transparent text-ash',
    lacquer: 'border border-lacquer/40 bg-lacquer-15 text-lacquer',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-xs font-sans select-none",
        stylesMap[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export { TagBadge };
