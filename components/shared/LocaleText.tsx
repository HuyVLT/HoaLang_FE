'use client';

import React from 'react';
import { useLocale } from 'next-intl';

import { MultilingualText } from './VillageCard';

export interface LocaleTextProps {
  /**
   * Object containing multi-language translation strings
   */
  content: MultilingualText;
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * LocaleText - A lightweight utility component that renders the correct translation
 * string based on the active next-intl locale.
 * Fallbacks cleanly to Vietnamese ('vi') if a specific language is undefined.
 */
export default function LocaleText({ content, className }: LocaleTextProps) {
  const locale = useLocale();

  // Resolve active translation string or fallback to vi / en
  const resolvedText = content[locale] || content['vi'] || content['en'] || '';

  return (
    <span className={className}>
      {resolvedText}
    </span>
  );
}

export { LocaleText };
