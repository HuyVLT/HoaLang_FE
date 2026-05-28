'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GallerySection as GallerySectionType } from '@/types/tenant';
import { SectionLabel, LocaleText } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function GallerySection({ section }: { section: GallerySectionType }) {
  const { heading, subheading, images } = section;

  return (
    <section
      className="bg-cream py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-4">
            <SectionLabel label="Không gian làng cổ / Gallery" />
          </motion.div>
          
          <motion.h2
            variants={fadeUp}
            className="font-heading text-charcoal italic"
            style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', lineHeight: 1.15 }}
          >
            <LocaleText content={heading} />
          </motion.h2>

          {subheading && (
            <motion.p
              variants={fadeUp}
              className="font-sans text-ash text-sm tracking-wide mt-3 max-w-lg mx-auto leading-relaxed"
            >
              <LocaleText content={subheading} />
            </motion.p>
          )}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((img, index) => {
            // Apply asymmetric aspect ratios (e.g. 4/3 vs 3/2 vs 1/1) based on index to create visual interest!
            const aspectRatios = ['aspect-[4/3]', 'aspect-[3/2]', 'aspect-[1/1]', 'aspect-[3/2]', 'aspect-[4/3]'];
            const aspect = aspectRatios[index % aspectRatios.length];

            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="flex flex-col gap-3 group"
              >
                {/* Image Wrapper */}
                <div className={`relative ${aspect} rounded-sm overflow-hidden border border-stone/50 bg-parchment shrink-0`}>
                  <Image
                    src={img.url}
                    alt={img.caption ? 'Gallery masterwork' : 'Village gallery'}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-104"
                  />
                  {/* Subtle hover shading overlay */}
                  <div className="absolute inset-0 bg-ink/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
                </div>

                {/* Caption below */}
                {img.caption && (
                  <p className="font-sans text-ash text-[12px] italic leading-normal tracking-wide px-1.5 select-none opacity-80 group-hover:opacity-100 transition-opacity">
                    <LocaleText content={img.caption} />
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
