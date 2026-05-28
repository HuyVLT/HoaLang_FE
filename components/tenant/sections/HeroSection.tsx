'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { HeroSection as HeroSectionType } from '@/types/tenant';
import { SectionLabel, LocaleText } from '@/components/shared';

// Visual reveal variants
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

export default function HeroSection({ section }: { section: HeroSectionType }) {
  const { title, subtitle, backgroundImage, primaryCta, secondaryCta } = section;

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden select-none bg-charcoal">
      {/* Immersive visual backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Traditional craft village scenery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft, rich lacquer/ink dark overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Hero content area — bottom-aligned */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end"
        style={{
          paddingBottom: 'clamp(60px, 8vw, 100px)',
          paddingInline: 'var(--page-padding-x, clamp(20px, 5vw, 80px))',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-[1400px] mx-auto w-full"
        >
          {/* Tagline label */}
          <motion.div variants={fadeUp}>
            <SectionLabel
              label="DI SẢN TRUYỀN THỐNG / HERITAGE"
              className="text-cream/80 mb-6 font-semibold tracking-widest text-[10px]"
            />
          </motion.div>

          {/* Heading in editorial Cormorant Garamond */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-cream italic leading-[1.05] mb-5 font-light"
            style={{ fontSize: 'clamp(36px, 5.5vw, 76px)', letterSpacing: '-0.02em' }}
          >
            <LocaleText content={title} />
          </motion.h1>

          {/* Subtitle in Be Vietnam Pro */}
          <motion.p
            variants={fadeUp}
            className="font-sans font-light text-stone/90 leading-relaxed mb-8 max-w-2xl text-base sm:text-lg"
          >
            <LocaleText content={subtitle} />
          </motion.p>

          {/* Dynamic dual CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            {primaryCta && (
              <a href={primaryCta.link}>
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-[0.12em] text-[11px] px-8 py-3.5 rounded-sm hover:brightness-110 cursor-pointer shadow-sm transition-all"
                >
                  <LocaleText content={primaryCta.label} />
                  <ChevronRight className="w-4 h-4 text-accent" />
                </motion.span>
              </a>
            )}

            {secondaryCta && (
              <a href={secondaryCta.link}>
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-transparent text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[11px] px-8 py-3.5 rounded-sm border border-cream/30 hover:border-cream cursor-pointer transition-colors"
                >
                  <LocaleText content={secondaryCta.label} />
                </motion.span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Downward organic indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-60">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-accent"
        />
        <div className="w-[1px] h-10 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
