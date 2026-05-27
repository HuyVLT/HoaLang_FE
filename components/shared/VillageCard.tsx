'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/navigation';
import { TagBadge } from './TagBadge';
import { cn } from '@/lib/utils';

export interface MultilingualText {
  vi: string;
  en: string;
  ja?: string;
  ko?: string;
  zh?: string;
  [key: string]: string | undefined;
}

export interface VillageCardProps {
  /**
   * Safe unique identifier slug
   */
  slug: string;
  /**
   * Multilingual name mapping
   */
  name: MultilingualText;
  /**
   * The province where this craft village is located
   */
  province: string;
  /**
   * Craft categories list (e.g. ['gom', 'dat nung'])
   */
  categories: string[];
  /**
   * Cover photo URL
   */
  coverImage: string;
  /**
   * Whether the village is verified by HoaLang experts
   */
  isVerified?: boolean;
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * VillageCard - Represents a traditional Vietnamese craft village card.
 * Uses a vertical layout, 4/3 image aspect ratio, custom hover scaling effects,
 * and next-intl locale resolution.
 */
export default function VillageCard({
  slug,
  name,
  province,
  categories,
  coverImage,
  isVerified = false,
  className,
}: VillageCardProps) {
  const locale = useLocale();

  // Resolve village name based on current locale
  const resolvedName = name[locale] || name['vi'] || '';

  return (
    <Link href={`/villages/${slug}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex flex-col h-full bg-cream border border-stone rounded-sm overflow-hidden select-none hover:shadow-hover transition-shadow duration-300",
          className
        )}
      >
        {/* Aspect Ratio Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone/20">
          <motion.div
            className="w-full h-full relative"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={coverImage}
              alt={resolvedName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
              className="object-cover"
              priority={false}
            />
          </motion.div>

          {/* Expert Verified Badge */}
          {isVerified && (
            <div className="absolute top-3 left-3 bg-cream/95 backdrop-blur-xs border border-gold/40 px-2 py-0.5 rounded-[2px] shadow-sm select-none">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold flex items-center gap-1 font-sans">
                ✦ Verified
              </span>
            </div>
          )}
        </div>

        {/* Card Body Contents */}
        <div className="p-5 flex-grow flex flex-col justify-between text-left space-y-4">
          <div className="space-y-1.5">
            {/* Province Meta Text */}
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ash font-sans block">
              {province}
            </span>

            {/* Village Title */}
            <h3 className="font-heading text-[22px] font-semibold text-charcoal leading-snug hover:text-lacquer transition-colors line-clamp-1">
              {resolvedName}
            </h3>
          </div>

          {/* Craft Categories Badges */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.slice(0, 3).map((cat) => (
                <TagBadge key={cat} label={cat} variant="stone" />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export { VillageCard };
