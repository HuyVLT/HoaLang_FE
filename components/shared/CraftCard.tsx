'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

import { MultilingualText } from './VillageCard';

export interface CraftCardProps {
  /**
   * Multilingual name of the craft item
   */
  name: MultilingualText;
  /**
   * Price in VND
   */
  price: number;
  /**
   * Cover photo URL
   */
  coverImage: string;
  /**
   * Craft village name origin
   */
  villageName: string;
  /**
   * Current stock/inventory
   */
  stock?: number;
  /**
   * Optional custom click callback (e.g. for cart add or product click)
   */
  onQuickView?: () => void;
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * CraftCard - Represents a craft item card in the marketplace or craft village detail view.
 * Utilizes a vertical layout with a square 1:1 aspect ratio image and an overlay hover.
 */
export default function CraftCard({
  name,
  price,
  coverImage,
  villageName,
  stock = 0,
  onQuickView,
  className,
}: CraftCardProps) {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  // Resolve item name based on current locale
  const resolvedName = name[locale] || name['vi'] || '';

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-cream border border-stone rounded-sm overflow-hidden select-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Square 1:1 Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone/20">
        <Image
          src={coverImage}
          alt={resolvedName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 280px"
          className={cn(
            "object-cover transition-transform duration-600 ease-out-expo",
            isHovered ? "scale-[1.04]" : "scale-100"
          )}
          priority={false}
        />

        {/* Hover Quick View Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-ink-40 flex items-center justify-center p-4 backdrop-blur-[2px] cursor-pointer"
              onClick={onQuickView}
            >
              <motion.button
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="inline-flex items-center gap-2 bg-cream text-ink border border-stone px-4 py-2 text-[12px] font-semibold uppercase tracking-wider rounded-sm hover:border-bronze hover:text-lacquer transition-colors shadow-sm active:scale-[0.98]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Xem nhanh</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Out of Stock Label */}
        {stock === 0 && (
          <div className="absolute top-3 right-3 bg-lacquer/90 backdrop-blur-xs text-cream text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-xs select-none">
            Hết hàng
          </div>
        )}
      </div>

      {/* Card Contents */}
      <div className="p-4 flex-grow flex flex-col justify-between text-left space-y-3">
        <div className="space-y-1">
          {/* Origin Village Name */}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ash font-sans block truncate">
            {villageName}
          </span>

          {/* Product Name */}
          <h4 className="font-sans text-[14px] font-medium text-charcoal leading-snug line-clamp-2 hover:text-lacquer transition-colors">
            {resolvedName}
          </h4>
        </div>

        {/* Price Tag */}
        <div className="pt-1 flex items-center justify-between border-t border-stone/30">
          <span className="font-sans text-base font-semibold text-lacquer tracking-wide">
            {price.toLocaleString('vi-VN')} VND
          </span>
        </div>
      </div>
    </div>
  );
}

export { CraftCard };
