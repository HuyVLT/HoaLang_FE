'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';
import { ExperiencesSection as ExperiencesSectionType } from '@/types/tenant';
import { SectionLabel, LocaleText, useCheckoutStore } from '@/components/shared';

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

export default function ExperiencesSection({
  section,
}: {
  section: ExperiencesSectionType;
}) {
  const { heading, subheading, items = [] } = section;
  const locale = useLocale() as 'vi' | 'en';
  const openCheckout = useCheckoutStore(state => state.openCheckout);

  return (
    <section
      id="experiences"
      className="bg-cream py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-4">
            <SectionLabel label="Khám phá xưởng nghệ thuật / Workshops" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-charcoal italic"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.15 }}
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

        {/* Experience Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="flex flex-col sm:flex-row bg-parchment border border-stone rounded-sm overflow-hidden shadow-sm group hover:-translate-y-1 hover:shadow-hover transition-all duration-300"
            >
              {/* Left Side: Thumbnail (1:1 aspect) */}
              <div className="relative aspect-square sm:w-48 w-full overflow-hidden bg-stone/20 shrink-0">
                <Image
                  src={item.image}
                  alt="Workshop illustration"
                  fill
                  sizes="(max-w-768px) 100vw, 200px"
                  className="object-cover transition-transform duration-600 ease-out-expo group-hover:scale-104"
                />
              </div>

              {/* Right Side: Copy & Info */}
              <div className="p-6 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-3">
                  <h3 className="font-heading text-[20px] font-semibold italic text-charcoal leading-snug">
                    <LocaleText content={item.title} />
                  </h3>
                  <p className="font-sans text-ash font-light text-[13px] leading-relaxed line-clamp-3">
                    <LocaleText content={item.description} />
                  </p>
                </div>

                <div className="pt-4 border-t border-stone/30 flex flex-col gap-2 mt-4">
                  {/* Timing metadata */}
                  <div className="flex items-center gap-2 text-xs text-ash font-sans">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Thời lượng: {item.duration}</span>
                  </div>

                  {/* Pricing and Action button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 text-primary text-base font-semibold font-sans">
                      <Tag className="w-4 h-4 text-primary" />
                      <span>{item.price.toLocaleString('vi-VN')} VND / người</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openCheckout({
                        name: item.title[locale] || item.title.vi,
                        price: item.price,
                        type: 'workshop',
                        image: item.image,
                        villageName: heading.vi.includes('Lụa') ? 'Làng Lụa Vạn Phúc' : 'Làng Gốm Bát Tràng'
                      })}
                      className="bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-widest text-[9px] px-4 py-2 rounded-xs border border-primary hover:brightness-110 shadow-sm transition-all"
                    >
                      Đặt chỗ
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
