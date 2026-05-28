'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TestimonialsSection as TestimonialsSectionType } from '@/types/tenant';
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

export default function TestimonialsSection({
  section,
}: {
  section: TestimonialsSectionType;
}) {
  const { heading, items = [] } = section;

  return (
    <section
      id="testimonials"
      className="bg-parchment py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-4">
            <SectionLabel label="Cảm nhận từ tâm hồn / Testimonials" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-charcoal italic"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.15 }}
          >
            <LocaleText content={heading} />
          </motion.h2>
        </motion.div>

        {/* Quotes list */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-cream border border-stone rounded-sm p-8 flex flex-col justify-between text-left select-none relative shadow-sm hover:shadow-hover transition-shadow duration-300"
            >
              {/* Giant quote mark back drop */}
              <span className="font-heading text-stone/15 text-8xl absolute top-3 left-4 select-none pointer-events-none font-serif">
                “
              </span>

              {/* Quote copy */}
              <p className="font-heading italic text-charcoal text-[17px] leading-relaxed mb-8 relative z-10 pl-2">
                <LocaleText content={item.quote} />
              </p>

              {/* Author info */}
              <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-stone/30">
                {item.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-sans font-semibold text-charcoal text-sm leading-snug">
                    {item.author}
                  </h4>
                  {item.role && (
                    <p className="font-sans text-[11px] uppercase tracking-wider text-ash mt-0.5">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
