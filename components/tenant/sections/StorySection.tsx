'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StorySection as StorySectionType } from '@/types/tenant';
import { SectionLabel, LocaleText } from '@/components/shared';
import { fadeUp, stagger } from './motion';

export default function StorySection({ section }: { section: StorySectionType }) {
  const { heading, storyText, artisanName, artisanTitle, image, quote } = section;

  return (
    <section
      className="bg-parchment py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Text block — columns 1 to 6 */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div variants={fadeUp} className="mb-4">
              <SectionLabel label="Hành trình nghệ thuật / Narrative" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-heading text-charcoal italic leading-tight mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
            >
              <LocaleText content={heading} />
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="font-sans text-ash/90 font-light leading-[1.8] text-base mb-8 text-justify"
            >
              <LocaleText content={storyText} />
            </motion.p>

            {/* Artisan card */}
            {artisanName && (
              <motion.div
                variants={fadeUp}
                className="border border-stone bg-cream rounded-sm p-5 relative overflow-hidden shrink-0"
              >
                {/* Turmeric left highlighting line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
                <h4 className="font-heading text-charcoal font-semibold text-lg italic mb-1">
                  <LocaleText content={artisanName} />
                </h4>
                {artisanTitle && (
                  <p className="font-sans text-xs uppercase tracking-wider text-ash font-medium">
                    <LocaleText content={artisanTitle} />
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Graphic block — columns 7 to 12 */}
          <div className="lg:col-span-6 relative">
            <motion.div
              variants={fadeUp}
              className="relative aspect-[4/5] rounded-sm overflow-hidden border border-stone shadow-sm group"
            >
              <Image
                src={image}
                alt="Artisan sculpting masterworks"
                fill
                sizes="(max-w-1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
              />
            </motion.div>

            {/* Float quote banner */}
            {quote && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 md:left-6 right-6 lg:-left-12 bg-charcoal text-cream rounded-sm p-6 border border-stone/20 shadow-md select-none hidden sm:block z-10"
              >
                <span className="font-heading text-accent text-5xl absolute -top-3 left-3 opacity-20 pointer-events-none select-none font-serif">
                  “
                </span>
                <p className="font-heading italic text-stone/90 leading-relaxed text-[17px] relative z-10 pl-4">
                  <LocaleText content={quote} />
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
