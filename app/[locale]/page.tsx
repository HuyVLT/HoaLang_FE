'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Package, ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import SectionLabel from '@/components/shared/SectionLabel';
import VillageCard from '@/components/shared/VillageCard';
import OrnamentDivider from '@/components/shared/OrnamentDivider';
import AnimatedNumber from '@/components/shared/AnimatedNumber';
import CraftCard from '@/components/shared/CraftCard';

/* ─────────────────── Framer Motion Variants ─────────────────── */
const fadeUp: import('framer-motion').Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: import('framer-motion').Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/* ─────────────────── Multilingual Mock Data ─────────────────── */
const featuredVillages = [
  {
    slug: 'bat-trang',
    name: { vi: 'Làng Gốm Bát Tràng', en: 'Bat Trang Pottery Village', zh: '八场陶瓷村', ja: 'バッチャン陶器村', ko: '밧짱 도자기 마을' },
    province: { vi: 'Hà Nội', en: 'Ha Noi', zh: '河内', ja: 'ハノイ', ko: '하노이' },
    categories: {
      vi: ['Gốm sứ', 'Đất nung', 'Thủ công'],
      en: ['Ceramics', 'Terracotta', 'Handicraft'],
      zh: ['陶瓷', '红陶', '手工艺'],
      ja: ['陶磁器', 'テラコッタ', '手芸'],
      ko: ['도자기', '테라코타', '수공예']
    },
    coverImage: '/images/village-bat-trang.png',
    isVerified: true,
  },
  {
    slug: 'van-phuc',
    name: { vi: 'Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village', zh: '万福丝绸村', ja: 'ヴァンフック絹村', ko: '반푹 실크 마을' },
    province: { vi: 'Hà Nội', en: 'Ha Noi', zh: '河内', ja: 'ハノイ', ko: '하노이' },
    categories: {
      vi: ['Dệt lụa', 'Thêu thùa'],
      en: ['Silk Weaving', 'Embroidery'],
      zh: ['丝绸织造', '刺绣'],
      ja: ['絹織物', '刺繍'],
      ko: ['실크 직조', '자수']
    },
    coverImage: '/images/village-van-phuc.png',
    isVerified: true,
  },
  {
    slug: 'dong-ho',
    name: { vi: 'Làng Tranh Đông Hồ', en: 'Dong Ho Folk Painting Village', zh: '东湖民间画村', ja: 'ドンホー版画村', ko: '동호 민화 마을' },
    province: { vi: 'Bắc Ninh', en: 'Bac Ninh', zh: '北宁', ja: 'バクニン', ko: '박닌' },
    categories: {
      vi: ['Tranh dân gian', 'Giấy điệp'],
      en: ['Folk Painting', 'Diep Paper'],
      zh: ['民间画', '迭纸'],
      ja: ['民俗版画', 'ジエップ紙'],
      ko: ['민화', '디엡 종이']
    },
    coverImage: '/images/village-dong-ho.png',
    isVerified: false,
  },
];

const featuredCrafts = [
  {
    name: { vi: 'Bình Gốm Men Ngọc Bát Tràng', en: 'Bat Trang Celadon Vase', zh: '八场青瓷瓶', ja: 'バッチャン青磁花瓶', ko: '밧짱 청자 화병' },
    price: 480000,
    coverImage: '/images/village-bat-trang.png',
    villageName: { vi: 'Làng Gốm Bát Tràng', en: 'Bat Trang Pottery Village', zh: '八场陶瓷村', ja: 'バッチャン陶器村', ko: '밧짱 도자기 마을' },
    stock: 12,
  },
  {
    name: { vi: 'Khăn Lụa Vạn Phúc Thêu Hoa Sen', en: 'Van Phuc Lotus Silk Scarf', zh: '万福荷花丝巾', ja: 'ヴァンフック蓮刺繍シルクスカーフ', ko: '반푹 연꽃 자수 실크 스카프' },
    price: 320000,
    coverImage: '/images/village-van-phuc.png',
    villageName: { vi: 'Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village', zh: '万福丝绸村', ja: 'ヴァンフック絹村', ko: '반푹 실크 마을' },
    stock: 5,
  },
  {
    name: { vi: 'Tranh Đông Hồ Lợn Đàn', en: 'Dong Ho Pig Family Folk Print', zh: '东湖母猪群小猪民间画', ja: 'ドンホー民俗版画「子連れ豚」', ko: '동호 민화 "돼지 가족"' },
    price: 185000,
    coverImage: '/images/village-dong-ho.png',
    villageName: { vi: 'Làng Tranh Đông Hồ', en: 'Dong Ho Folk Painting Village', zh: '东湖民间画村', ja: 'ドンホー版画村', ko: '동호 민화 마을' },
    stock: 0,
  },
  {
    name: { vi: 'Nón Lá Huế Thêu Tay', en: 'Hand-Embroidered Hue Conical Hat', zh: '顺化手绣斗笠', ja: 'フエ手刺繍ノンラー', ko: '훼 손자수 논라' },
    price: 250000,
    coverImage: '/images/craft-non-la.png',
    villageName: { vi: 'Làng Nón Tây Hồ', en: 'Tay Ho Conical Hat Village', zh: '西湖斗笠村', ja: 'タイホーノンラー村', ko: '테이호 논라 마을' },
    stock: 8,
  },
];

/* ─────────────────── Page Component ─────────────────── */
export default function LandingPage() {
  const locale = useLocale();
  const tHero = useTranslations('hero');
  const tFeatured = useTranslations('featured');
  const tHow = useTranslations('howItWorks');
  const tStats = useTranslations('stats');
  const tCrafts = useTranslations('crafts');
  const tQuote = useTranslations('quote');
  const tCta = useTranslations('cta');

  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
    }
  };

  const steps = [
    {
      icon: Map,
      step: '01',
      title: tHow('step1Title'),
      desc: tHow('step1Desc'),
    },
    {
      icon: Sparkles,
      step: '02',
      title: tHow('step2Title'),
      desc: tHow('step2Desc'),
    },
    {
      icon: Package,
      step: '03',
      title: tHow('step3Title'),
      desc: tHow('step3Desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-parchment">

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative h-screen min-h-[640px] overflow-hidden"
      >
        {/* Static Background Image — no JS parallax to avoid scroll jank */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-village.jpg"
            alt="Nghe nhan dan lat lang nghe truyen thong Viet Nam"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Gradient Overlay — ink-70 bottom → transparent top */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to top, rgba(26,18,8,0.82) 0%, rgba(26,18,8,0.45) 50%, rgba(26,18,8,0.10) 100%)',
          }}
        />

        {/* Hero Content — bottom-anchored */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end"
          style={{ paddingBottom: '80px', paddingInline: 'clamp(20px, 5vw, 80px)' }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-content mx-auto w-full"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel
                label={tHero('discover')}
                className="text-cream/80 mb-6"
              />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-cream italic leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(44px, 6vw, 80px)', letterSpacing: '-0.02em' }}
            >
              {tHero('title')}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans font-light text-stone leading-relaxed mb-8 max-w-xl"
              style={{ fontSize: 'clamp(16px, 1.5vw, 18px)' }}
            >
              {tHero('subtitle')}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/map">
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-lacquer text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-8 py-3.5 rounded-sm cursor-pointer transition-colors hover:bg-[#7a1616]"
                >
                  {tHero('ctaExplore')}
                  <Map className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/villages">
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-transparent text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-8 py-3.5 rounded-sm border border-cream/40 hover:border-cream cursor-pointer transition-colors"
                >
                  {tHero('ctaVillages')}
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom-right stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 right-8 z-30 hidden md:flex items-center gap-4"
        >
          {[tHero('statVillages'), tHero('statProvinces'), tHero('statRegions')].map((stat, i) => (
            <span key={i} className="flex items-center gap-4">
              {i > 0 && <span className="w-px h-5 bg-stone/30" />}
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-stone/70">
                {stat}
              </span>
            </span>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2">
          <motion.span
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone/60 [writing-mode:vertical-rl]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {tHero('scroll')}
          </motion.span>
          <motion.div
            className="w-px bg-stone/40 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: 40 }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — FEATURED VILLAGES
      ════════════════════════════════════════════ */}
      <section
        id="featured-villages"
        className="bg-parchment"
        style={{
          paddingBlock: 'clamp(64px, 8vw, 120px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto">

          {/* Header row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <motion.div variants={fadeUp}>
                <SectionLabel label={tFeatured('label')} className="mb-4" />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-charcoal italic"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.15 }}
              >
                {tFeatured('title')}
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/villages">
                <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-widest text-bronze hover:text-lacquer transition-colors group">
                  {tFeatured('viewAll')}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Asymmetric grid: large left (2fr) + 2 stacked right (1fr) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* Featured large card — takes 2 cols */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <VillageCard
                slug={featuredVillages[0].slug}
                name={featuredVillages[0].name}
                province={featuredVillages[0].province[locale as 'vi' | 'en'] || featuredVillages[0].province.vi}
                categories={featuredVillages[0].categories[locale as 'vi' | 'en'] || featuredVillages[0].categories.vi}
                coverImage={featuredVillages[0].coverImage}
                isVerified={featuredVillages[0].isVerified}
              />
            </motion.div>

            {/* Two smaller cards stacked */}
            <div className="flex flex-col gap-5">
              {featuredVillages.slice(1).map((v, i) => (
                <motion.div key={v.slug} variants={fadeUp} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
                  <VillageCard
                    slug={v.slug}
                    name={v.name}
                    province={v.province[locale as 'vi' | 'en'] || v.province.vi}
                    categories={v.categories[locale as 'vi' | 'en'] || v.categories.vi}
                    coverImage={v.coverImage}
                    isVerified={v.isVerified}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <OrnamentDivider className="max-w-content mx-auto text-stone px-8" />

      {/* ═══════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="bg-charcoal"
        style={{
          paddingBlock: 'clamp(64px, 8vw, 120px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto">

          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <SectionLabel label={tHow('label')} className="text-gold" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-heading text-cream italic"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.15 }}
            >
              {tHow('title')}
            </motion.h2>
          </motion.div>

          {/* Steps grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12 relative"
          >
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-stone/20" />

            {steps.map(({ icon: Icon, step, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative flex flex-col items-center md:items-start text-center md:text-left"
              >
                {/* Background step number */}
                <span
                  className="absolute -top-2 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 font-heading font-light select-none pointer-events-none"
                  style={{
                    fontSize: '80px',
                    lineHeight: 1,
                    color: 'rgba(196,149,42,0.12)',
                  }}
                >
                  {step}
                </span>

                {/* Icon circle */}
                <div className="relative z-10 w-12 h-12 rounded-full border border-stone/30 flex items-center justify-center mb-6 bg-charcoal">
                  <Icon className="w-5 h-5 text-gold" />
                </div>

                <h3 className="relative z-10 font-heading text-cream text-[22px] font-semibold leading-snug mb-3">
                  {title}
                </h3>
                <p className="relative z-10 font-sans text-ash text-[14px] leading-[1.7]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — STATS BANNER
      ════════════════════════════════════════════ */}
      <section
        id="stats"
        className="bg-lacquer"
        style={{ paddingBlock: 'clamp(48px, 6vw, 80px)', paddingInline: 'clamp(20px, 5vw, 80px)' }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-0"
        >
          {[
            { value: 120, suffix: '+', label: tStats('villages') },
            { value: 500, suffix: '+', label: tStats('artisans') },
            { value: 1200, suffix: '+', label: tStats('products') },
            { value: 40, suffix: '', label: tStats('provinces') },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="relative flex flex-col items-center py-6 md:py-0 text-center"
            >
              {/* Vertical divider */}
              {i > 0 && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-cream/20" />
              )}
              <span
                className="font-heading text-cream font-light"
                style={{ fontSize: 'clamp(40px, 4vw, 56px)' }}
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1.8}
                  className="font-heading text-cream font-light"
                />
              </span>
              <span className="font-sans text-cream/70 uppercase tracking-[0.12em] text-[11px] font-semibold mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — FEATURED CRAFTS
      ════════════════════════════════════════════ */}
      <section
        id="featured-crafts"
        className="bg-cream"
        style={{
          paddingBlock: 'clamp(64px, 8vw, 120px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <motion.div variants={fadeUp}>
                <SectionLabel label={tCrafts('label')} className="mb-4" />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-charcoal italic"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.15 }}
              >
                {tCrafts('title')}
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/shop">
                <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-widest text-bronze hover:text-lacquer transition-colors group">
                  {tCrafts('viewAll')}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Horizontal scroll on mobile, 4-col on desktop */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-none"
          >
            {featuredCrafts.map((craft, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="shrink-0 w-64 snap-start md:w-auto"
              >
                <CraftCard
                  name={craft.name}
                  price={craft.price}
                  coverImage={craft.coverImage}
                  villageName={craft.villageName[locale as 'vi' | 'en'] || craft.villageName.vi}
                  stock={craft.stock}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — EDITORIAL QUOTE
      ════════════════════════════════════════════ */}
      <section id="editorial-quote" className="relative overflow-hidden" style={{ height: 'clamp(400px, 55vw, 640px)' }}>
        <Image
          src="/images/editorial-artisan.png"
          alt="Nghe nhan lam gom truyen thong Bat Trang"
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay ink-40 */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'rgba(26,18,8,0.52)' }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
          style={{ paddingInline: 'clamp(20px, 8vw, 160px)' }}
        >
          <motion.div variants={fadeUp}>
            <OrnamentDivider className="text-stone/40 mb-8" />
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="font-heading text-cream italic max-w-3xl"
            style={{ fontSize: 'clamp(24px, 3vw, 42px)', lineHeight: 1.3 }}
          >
            &ldquo;{tQuote('text')}&rdquo;
          </motion.blockquote>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-1">
            <span className="font-sans text-stone text-[14px] font-semibold tracking-wider">
              {tQuote('author')}
            </span>
            <span className="font-sans text-stone/60 text-[12px] uppercase tracking-widest">
              {tQuote('title')}
            </span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <OrnamentDivider className="text-stone/40 mt-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — CTA / AI ITINERARY NEWSLETTER
      ════════════════════════════════════════════ */}
      <section
        id="cta-newsletter"
        className="bg-cream"
        style={{
          paddingBlock: 'clamp(80px, 10vw, 140px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <SectionLabel label={tCta('label')} />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-charcoal italic mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.1 }}
          >
            {tCta('title')}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans text-ash leading-[1.8] mb-10"
            style={{ fontSize: 'clamp(15px, 1.4vw, 17px)' }}
          >
            {tCta('desc')}
          </motion.p>

          <motion.div variants={fadeUp}>
            <AnimatePresence mode="wait">
              {!emailSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tCta('placeholder')}
                    className="flex-1 bg-transparent border-b border-stone text-ink font-sans text-[15px] py-2.5 px-0 placeholder:text-ash/60 focus:outline-none focus:border-bronze transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-7 py-3 rounded-sm hover:bg-[#7a1616] transition-colors shrink-0"
                  >
                    {tCta('button')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="font-heading text-charcoal text-[22px] italic">
                    {tCta('successTitle')}
                  </span>
                  <span className="font-sans text-ash text-[14px]">
                    {tCta('successDesc')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-sans text-ash/60 text-[12px] uppercase tracking-[0.1em] mt-5"
          >
            {tCta('footer')}
          </motion.p>
        </motion.div>
      </section>

    </div>
  );
}
