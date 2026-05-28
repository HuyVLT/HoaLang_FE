'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CTASection as CTASectionType } from '@/types/tenant';
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

export default function CTASection({ section }: { section: CTASectionType }) {
  const {
    heading,
    description,
    buttonText,
    placeholderText = { vi: 'Địa chỉ email của bạn...', en: 'Your email address...' },
    successTitle = { vi: 'Kết nối thành công!', en: 'Successfully Connected!' },
    successDesc = { vi: 'Thư giới thiệu di sản sẽ sớm được gửi tới bạn.', en: 'Our premium heritage newsletter is on its way.' },
  } = section;

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="cta-newsletter"
      className="bg-cream border-t border-b border-stone/50 py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Label centered */}
          <motion.div variants={fadeUp} className="flex justify-center mb-5 select-none">
            <SectionLabel label="Kết nối di sản / Subscribe" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="font-heading text-charcoal italic mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}
          >
            <LocaleText content={heading} />
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="font-sans text-ash font-light leading-[1.8] mb-10 max-w-xl mx-auto text-sm sm:text-base"
          >
            <LocaleText content={description} />
          </motion.p>

          {/* Dynamic state container */}
          <motion.div variants={fadeUp}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-stretch"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholderText.vi}
                    className="flex-grow bg-transparent border-b border-stone text-ink font-sans text-sm py-2.5 px-1 placeholder:text-ash/60 focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-[0.12em] text-[10px] px-7 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all duration-300 shrink-0"
                  >
                    <LocaleText content={buttonText} />
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-2 max-w-sm mx-auto"
                >
                  <span className="font-heading text-charcoal text-[22px] italic font-semibold">
                    <LocaleText content={successTitle} />
                  </span>
                  <span className="font-sans text-ash text-sm font-light text-center leading-relaxed">
                    <LocaleText content={successDesc} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
