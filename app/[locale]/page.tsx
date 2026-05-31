'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Package, ArrowRight, ArrowUpRight, Compass } from 'lucide-react';
import { useLocale } from 'next-intl';
import { getTenantUrl } from '@/lib/tenant-url';
import { MapboxVillage } from '@/components/shared/MapboxMap';

import {
  SectionLabel,
  VillageCard,
  AnimatedNumber,
  MapboxMap,
  LocaleText
} from '@/components/shared';

/* ─────────────────── Framer Motion Variants ─────────────────── */
const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: import('framer-motion').Variants = {
  hidden: {},
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
    isVerified: true,
  },
];

/* ─────────────────── Bilingual Text Dictionary ─────────────────── */
const bilingualContent = {
  heroTag: {
    vi: 'Nền tảng số hoá di sản làng nghề',
    en: 'Digital Heritage Multi-Tenant Platform',
  },
  heroTitle: {
    vi: 'Đưa di sản làng nghề cất cánh trong kỷ nguyên số',
    en: 'Empower Traditional Craft Villages in the Digital Age',
  },
  heroDesc: {
    vi: 'HoaLang giúp các làng nghề truyền thống khởi tạo website riêng biệt chỉ trong 3 bước. Tích hợp bản đồ số 3D, shop mỹ nghệ trực tuyến và công cụ đặt lịch trải nghiệm nghệ thuật cao cấp.',
    en: 'HoaLang empowers traditional craft villages to spin up custom storefronts in 3 steps. Integrate interactive 3D maps, e-commerce boutiques, and premium cultural workshop booking engines.',
  },
  heroCtaJoin: {
    vi: 'Đăng ký mở gian hàng làng nghề',
    en: 'Register Craft Storefront',
  },
  heroCtaMap: {
    vi: 'Khám phá bản đồ di sản',
    en: 'Explore Heritage Map',
  },

  // Map section
  mapLabel: {
    vi: 'Hệ thống Bản đồ số / Interactive Map Module',
    en: 'Interactive 3D Heritage Map',
  },
  mapTitle: {
    vi: 'Bản Đồ Di Sản Số Làng Nghề 3D',
    en: 'Interactive 3D Heritage Map',
  },
  mapDesc: {
    vi: 'Mở rộng khả năng tiếp cận du khách quốc tế thông qua bản đồ di sản số 3D. Làng nghề được định vị toạ độ chính xác, tích hợp thẻ chỉ đường thông minh và trang giới thiệu văn hoá riêng biệt.',
    en: 'Pinpoint exact location coordinates, integrate 3D realistic maps, and showcase your cultural history context directly to global travelers.',
  },

  // Villages section
  villagesLabel: {
    vi: 'Mạng lưới di sản / Our merchant network',
    en: 'Our digitized craft network',
  },
  villagesTitle: {
    vi: 'Các Làng Nghề Đang Đồng Hành',
    en: 'Thriving Digital Heritage Communities',
  },
  villagesViewAll: {
    vi: 'Xem tất cả làng nghề',
    en: 'View all craft villages',
  },

  // Itinerary section
  itineraryLabel: {
    vi: 'Hành Trình Thông Minh / AI Itinerary Module',
    en: 'AI Itinerary Planner',
  },
  itineraryTitle: {
    vi: 'Cá Nhân Hóa Trải Nghiệm Bằng Trí Tuệ Nhân Tạo',
    en: 'Intelligent AI Itinerary Planning',
  },
  itineraryStep1Title: {
    vi: '01. Chọn Điểm Khám Phá',
    en: '01. Discover Spots',
  },
  itineraryStep1Desc: {
    vi: 'Duyệt hơn 120 làng nghề truyền thống Việt Nam trên bản đồ di sản trực quan của hệ thống.',
    en: 'Browse over 120 traditional Vietnamese craft villages on our visual interactive map.',
  },
  itineraryStep2Title: {
    vi: '02. AI Lên Lịch Trình Tự Động',
    en: '02. Instant Planning',
  },
  itineraryStep2Desc: {
    vi: 'Thuật toán phân tích sở thích và quỹ thời gian để phác họa lịch trình đi lại, ghé xưởng nghệ nhân tối ưu.',
    en: 'Our AI analyzes your preferences to craft the most optimized routes and workshop visitation plans.',
  },
  itineraryStep3Title: {
    vi: '03. Khởi Hành Thực Địa',
    en: '03. Embark & Enjoy',
  },
  itineraryStep3Desc: {
    vi: 'Du khách quét mã QR để đồng bộ bản đồ dẫn đường, lưu trữ vé đặt workshop trực tiếp cực kỳ mượt mà.',
    en: 'Scan QR code to sync maps navigation, store booked workshop vouchers, and start your real-world tour.',
  },

  // Shop section
  shopLabel: {
    vi: 'Gian hàng trực tuyến / E-commerce Hub',
    en: 'Dedicated E-commerce Module',
  },
  shopTitle: {
    vi: 'Hệ Thống Cửa Hàng Trực Tuyến Độc Bản',
    en: 'Bespoke Craft E-commerce Hubs',
  },
  shopDesc: {
    vi: 'Sở hữu một website e-commerce hoàn chỉnh định danh thương hiệu riêng biệt. Nghệ nhân tự quản lý kho hàng, giỏ hàng trực quan và nhận doanh thu bán hàng trực tiếp không qua trung gian.',
    en: 'Deploy a complete e-commerce boutique storefront on a dedicated subdomain. Artisans fully manage inventory and receive orders direct from global customers without middlemen.',
  },

  // Experience section
  expLabel: {
    vi: 'Đặt lịch trải nghiệm / Booking Engine',
    en: 'Artisan Workshop Booking',
  },
  expTitle: {
    vi: 'Công Cụ Đặt Lịch Workshop Nghệ Thuật',
    en: 'Seamless Workshop Booking Engine',
  },
  expDesc: {
    vi: 'Số hóa lịch trình tổ chức khóa học nặn gốm, se tơ, dệt lụa. Tự động hóa việc tiếp nhận du khách, kiểm soát số lượng học viên tối đa tại xưởng mộc của nghệ nhân.',
    en: 'Digitize your workshop calendars for pottery making, silk weaving, and wood painting. Automate visitor limits and intake sheets directly at the studio.',
  },

  // Stats
  statsVillages: {
    vi: 'Làng nghề số hoá',
    en: 'Digitized Villages',
  },
  statsArtisans: {
    vi: 'Nghệ nhân đồng hành',
    en: 'Active Artisans',
  },
  statsProducts: {
    vi: 'Tác phẩm mỹ nghệ',
    en: 'Exquisite Crafts',
  },
  statsProvinces: {
    vi: 'Tỉnh thành phủ sóng',
    en: 'Provinces Covered',
  },

  // Onboarding registration
  ctaLabel: {
    vi: 'Đăng ký đối tác làng nghề / Merchant Platform',
    en: 'Become a Tenant Member',
  },
  ctaTitle: {
    vi: 'Đưa Làng Nghề Của Bạn Lên Bản Đồ Số Di Sản',
    en: 'Digitize Your Craft Heritage Today',
  },
  ctaDesc: {
    vi: 'Khởi tạo không gian số hóa làng nghề độc lập của riêng bạn với starter template tinh tế, hỗ trợ vận hành shop mỹ nghệ, đặt lịch workshop và tối ưu hoá SEO toàn diện.',
    en: 'Provision your independent digital craft workspace in seconds with premium templates, custom commerce hubs, and integrated SEO routing.',
  },
  ctaButton: {
    vi: 'Đăng ký mở gian hàng làng nghề',
    en: 'Start Free Onboarding Now',
  },
  ctaFooter: {
    vi: 'Khởi tạo trong 3 phút  •  Hệ thống Multi-Tenant riêng biệt  •  Không phí ẩn',
    en: '3-minute setup  •  Dedicated Multi-Tenant subdomains  •  Zero hidden fees',
  },
};

const mapVillages = [
  {
    slug: 'bat-trang',
    name: { vi: 'Làng Gốm Bát Tràng', en: 'Bat Trang Pottery Village' },
    province: { vi: 'Hà Nội', en: 'Ha Noi' },
    categories: { vi: ['Gốm sứ', 'Đất nung'], en: ['Ceramics', 'Terracotta'] },
    description: {
      vi: 'Làng gốm cổ nằm bên dòng sông Hồng lịch sử, nổi tiếng với kỹ thuật xoay gốm thủ công bằng tay.',
      en: 'An ancient pottery village nested along the Red River, renowned for handcrafted wheel-turning.'
    },
    lng: 105.9327,
    lat: 20.9733,
    coverImage: '/images/village-bat-trang.png',
    isVerified: true,
  },
  {
    slug: 'van-phuc',
    name: { vi: 'Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village' },
    province: { vi: 'Hà Nội', en: 'Ha Noi' },
    categories: { vi: ['Dệt lụa', 'Tơ tằm'], en: ['Silk Weaving', 'Mulberry Silk'] },
    description: {
      vi: 'Cái nôi của dòng lụa Vân lụa Hà Đông tơ tằm nguyên bản.',
      en: 'The cradle of premium Ha Dong mulberry silk.'
    },
    lng: 105.7725,
    lat: 20.9767,
    coverImage: '/images/village-van-phuc.png',
    isVerified: true,
  },
  {
    slug: 'dong-ho',
    name: { vi: 'Làng Tranh Đông Hồ', en: 'Dong Ho Folk Painting Village' },
    province: { vi: 'Bắc Ninh', en: 'Bac Ninh' },
    categories: { vi: ['Tranh dân gian', 'Bản khắc gỗ'], en: ['Folk Painting', 'Woodblock Print'] },
    description: {
      vi: 'Nơi sản sinh ra các bức tranh khắc gỗ mộc mạc in trên nền giấy điệp lấp lánh.',
      en: 'Home of rustic folk woodblock prints pressed onto shimmering scallop-shell Diep paper.'
    },
    lng: 106.0744,
    lat: 21.0967,
    coverImage: '/images/village-dong-ho.png',
    isVerified: false,
  },
  {
    slug: 'non-nuoc',
    name: { vi: 'Làng Đá Non Nước', en: 'Non Nuoc Stone Carving Village' },
    province: { vi: 'Đà Nẵng', en: 'Da Nang' },
    categories: { vi: ['Điêu khắc đá', 'Mỹ nghệ'], en: ['Stone Carving', 'Fine Crafts'] },
    description: {
      vi: 'Tọa lạc dưới chân núi Ngũ Hành Sơn hùng vĩ, nổi tiếng với nghệ thuật chế tác đá cẩm thạch.',
      en: 'Nestled at the foot of the Marble Mountains, famous for grand marble sculptures.'
    },
    lng: 108.2619,
    lat: 16.0125,
    coverImage: '/images/register_silk_bg.png',
    isVerified: false,
  },
  {
    slug: 'thanh-ha',
    name: { vi: 'Làng Gốm Thanh Hà', en: 'Thanh Ha Pottery Village' },
    province: { vi: 'Quảng Nam', en: 'Quang Nam' },
    categories: { vi: ['Gốm đất nung', 'Sản phẩm mộc'], en: ['Terracotta', 'Clay Crafts'] },
    description: {
      vi: 'Làng nghề ven dòng Thu Bồn êm đềm, nổi tiếng với các sản phẩm gốm mộc không tráng men.',
      en: 'A peaceful terracotta village on the Thu Bon riverbanks, specializing in unglazed earthenware.'
    },
    lng: 108.3072,
    lat: 15.8825,
    coverImage: '/images/login_pottery_bg.png',
    isVerified: true,
  },
  {
    slug: 'phuoc-kieu',
    name: { vi: 'Làng Đúc Đồng Phước Kiều', en: 'Phuoc Kieu Bronze Casting Village' },
    province: { vi: 'Quảng Nam', en: 'Quang Nam' },
    categories: { vi: ['Đúc đồng', 'Cồng chiêng'], en: ['Bronze Casting', 'Gongs & Bells'] },
    description: {
      vi: 'Vương quốc của những lò nung cồng chiêng, nhạc cụ, chuông đồng cổ xưa.',
      en: 'A sanctuary of sacred bronze gongs, temple bells, and royal bronze items.'
    },
    lng: 108.2325,
    lat: 15.8592,
    coverImage: '/images/village-van-phuc.png',
    isVerified: false,
  }
];

export default function LandingPage() {
  const locale = useLocale() as 'vi' | 'en';
  const [selectedVillage, setSelectedVillage] = useState<MapboxVillage | null>(null);

  return (
    <div className="min-h-screen bg-parchment overflow-x-hidden selection:bg-lacquer/10 selection:text-lacquer">

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO (Giới thiệu & Lời mời)
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
            className="max-w-content mx-auto w-full text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel
                label={locale === 'vi' ? bilingualContent.heroTag.vi : bilingualContent.heroTag.en}
                className="text-cream/85 mb-6"
              />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-cream italic leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(44px, 6vw, 80px)', letterSpacing: '-0.02em' }}
            >
              <LocaleText content={bilingualContent.heroTitle} />
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans font-light text-stone leading-relaxed mb-8 max-w-xl"
              style={{ fontSize: 'clamp(16px, 1.5vw, 18px)' }}
            >
              <LocaleText content={bilingualContent.heroDesc} />
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/onboarding">
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-lacquer text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-8 py-3.5 rounded-sm cursor-pointer transition-colors hover:bg-[#7a1616]"
                >
                  <LocaleText content={bilingualContent.heroCtaJoin} />
                  <ArrowRight className="w-4 h-4 text-gold" />
                </motion.span>
              </Link>
              <Link href="/map">
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-transparent text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-8 py-3.5 rounded-sm border border-cream/40 hover:border-cream cursor-pointer transition-colors"
                >
                  <LocaleText content={bilingualContent.heroCtaMap} />
                  <ArrowUpRight className="w-4 h-4 text-cream/70" />
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
          {locale === 'vi' ? (
            ['120+ Làng Nghề', '40+ Tỉnh Thành', '8 Vùng Văn Hoá'].map((stat, i) => (
              <span key={i} className="flex items-center gap-4">
                {i > 0 && <span className="w-px h-5 bg-stone/30" />}
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-stone/70">
                  {stat}
                </span>
              </span>
            ))
          ) : (
            ['120+ Villages', '40+ Provinces', '8 Regions'].map((stat, i) => (
              <span key={i} className="flex items-center gap-4">
                {i > 0 && <span className="w-px h-5 bg-stone/30" />}
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-stone/70">
                  {stat}
                </span>
              </span>
            ))
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2">
          <motion.span
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone/60 [writing-mode:vertical-rl]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            SCROLL
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
          SECTION 2 — BẢN ĐỒ (Interactive Map)
      ════════════════════════════════════════════ */}
      <section
        id="map"
        className="bg-cream border-b border-stone/30"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 130px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column: Text Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel label={locale === 'vi' ? bilingualContent.mapLabel.vi : bilingualContent.mapLabel.en} />
            <h2 className="font-heading text-charcoal italic" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15 }}>
              <LocaleText content={bilingualContent.mapTitle} />
            </h2>
            <p className="font-sans text-xs text-ash leading-relaxed font-light">
              <LocaleText content={bilingualContent.mapDesc} />
            </p>
            <div className="h-px bg-stone/50 w-full" />
            <div className="flex gap-6">
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">3D Field</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Giao diện thực địa</span>
              </div>
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">SEO Optimized</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Tối ưu tìm kiếm</span>
              </div>
            </div>
          </div>

          {/* Right: Mapbox Interactive Map */}
          <div className="lg:col-span-7 h-[400px] relative overflow-hidden rounded-sm border border-stone">
            <MapboxMap
              villages={mapVillages}
              selectedVillage={selectedVillage}
              onSelectVillage={(v) => setSelectedVillage(v)}
              onExploreVillage={(v) => { window.location.href = getTenantUrl(v.slug); }}
              locale={locale as 'vi' | 'en'}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — LÀNG NGHỀ (Featured Tenants)
      ════════════════════════════════════════════ */}
      <section
        id="villages"
        className="bg-parchment border-b border-stone/30"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 130px)',
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
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14 text-left"
          >
            <div>
              <motion.div variants={fadeUp} className="mb-4">
                <SectionLabel label={locale === 'vi' ? bilingualContent.villagesLabel.vi : bilingualContent.villagesLabel.en} />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-charcoal italic"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15 }}
              >
                <LocaleText content={bilingualContent.villagesTitle} />
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/villages">
                <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-widest text-bronze hover:text-lacquer transition-colors group">
                  <LocaleText content={bilingualContent.villagesViewAll} />
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Staggered Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredVillages.map((v, i) => (
              <motion.div
                key={v.slug}
                variants={fadeUp}
                className={i === 1 ? 'md:translate-y-6' : ''}
              >
                <VillageCard
                  slug={v.slug}
                  name={v.name}
                  province={v.province[locale] || v.province.vi}
                  categories={v.categories[locale] || v.categories.vi}
                  coverImage={v.coverImage}
                  isVerified={v.isVerified}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — AI LỊCH TRÌNH (AI Itinerary)
      ════════════════════════════════════════════ */}
      <section
        id="itinerary"
        className="bg-charcoal text-cream border-b border-gold/20"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 130px)',
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
              <SectionLabel label={locale === 'vi' ? bilingualContent.itineraryLabel.vi : bilingualContent.itineraryLabel.en} className="text-gold" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-heading text-cream italic max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', lineHeight: 1.15 }}
            >
              <LocaleText content={bilingualContent.itineraryTitle} />
            </motion.h2>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          >
            <div className="hidden md:block absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-stone/20" />

            {[
              { title: bilingualContent.itineraryStep1Title, desc: bilingualContent.itineraryStep1Desc, icon: Compass },
              { title: bilingualContent.itineraryStep2Title, desc: bilingualContent.itineraryStep2Desc, icon: Sparkles },
              { title: bilingualContent.itineraryStep3Title, desc: bilingualContent.itineraryStep3Desc, icon: Package },
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-4"
                >
                  <div className="w-12 h-12 rounded-xs border border-stone/30 flex items-center justify-center bg-charcoal shadow-sm relative z-10">
                    <StepIcon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-cream text-[20px] font-semibold">
                    <LocaleText content={step.title} />
                  </h3>
                  <p className="font-sans text-ash text-[13px] leading-relaxed font-light max-w-xs">
                    <LocaleText content={step.desc} />
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — CỬA HÀNG (E-commerce Shop)
      ════════════════════════════════════════════ */}
      <section
        id="shop"
        className="bg-cream border-b border-stone/30"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 130px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column: Visual Mockup */}
          <div className="lg:col-span-7 bg-parchment border border-stone p-8 rounded-sm relative shadow-xs h-[340px] flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
            <div className="flex items-center justify-between border-b border-stone/30 pb-4">
              <span className="font-heading text-[15px] font-bold italic text-charcoal">
                Cửa hàng Làng Gốm Bát Tràng
              </span>
              <span className="font-sans text-[9px] uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold rounded-xs">
                Giao Dịch Trực Tiếp
              </span>
            </div>
            
            <div className="my-auto space-y-3 max-w-sm">
              <div className="font-heading text-xl italic text-charcoal font-semibold">
                Bình Gốm Men Ngọc Bát Tràng
              </div>
              <p className="font-sans text-[11px] text-ash font-light leading-relaxed">
                Đất sét sông Hồng được nhào nặn dưới bàn tay nghệ nhân và nung lò củi 1300°C cổ kính.
              </p>
              <div className="font-heading text-lg text-lacquer font-bold">480.000đ</div>
            </div>

            <div className="flex gap-2">
              <span className="px-3.5 py-1.5 bg-lacquer text-cream text-[9px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer">
                Thêm vào giỏ
              </span>
              <span className="px-3.5 py-1.5 border border-stone text-ash text-[9px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer">
                Xem nhanh
              </span>
            </div>
          </div>

          {/* Right Column: Text Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel label={locale === 'vi' ? bilingualContent.shopLabel.vi : bilingualContent.shopLabel.en} />
            <h2 className="font-heading text-charcoal italic" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15 }}>
              <LocaleText content={bilingualContent.shopTitle} />
            </h2>
            <p className="font-sans text-xs text-ash leading-relaxed font-light">
              <LocaleText content={bilingualContent.shopDesc} />
            </p>
            <div className="h-px bg-stone/50 w-full" />
            <div className="flex gap-6">
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">Direct</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Giao thương trực tiếp</span>
              </div>
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">Custom Domain</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Tự chủ thương hiệu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — TRẢI NGHIỆM (Artisan Booking)
      ════════════════════════════════════════════ */}
      <section
        id="experience"
        className="bg-parchment border-b border-stone/30"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 130px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column: Text Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel label={locale === 'vi' ? bilingualContent.expLabel.vi : bilingualContent.expLabel.en} />
            <h2 className="font-heading text-charcoal italic" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15 }}>
              <LocaleText content={bilingualContent.expTitle} />
            </h2>
            <p className="font-sans text-xs text-ash leading-relaxed font-light">
              <LocaleText content={bilingualContent.expDesc} />
            </p>
            <div className="h-px bg-stone/50 w-full" />
            <div className="flex gap-6">
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">Realtime</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Đồng bộ lịch biểu</span>
              </div>
              <div>
                <span className="font-heading text-lg font-bold italic text-lacquer">Audience Control</span>
                <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">Giới hạn số lượng</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="lg:col-span-7 bg-cream border border-stone p-8 rounded-sm relative shadow-xs h-[340px] flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
            <div className="flex items-center justify-between border-b border-stone/30 pb-4">
              <span className="font-heading text-[15px] font-bold italic text-charcoal">
                Workshop Trải Nghiệm Xoay Gốm
              </span>
              <span className="font-sans text-[9px] uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 font-semibold rounded-xs">
                Chờ Phê Duyệt
              </span>
            </div>

            <div className="my-auto space-y-4">
              <div className="flex items-center gap-4 text-xs font-sans text-ash">
                <span className="bg-stone/20 px-3 py-1 font-semibold rounded-xs text-charcoal">29 Tháng 5</span>
                <span>Khung giờ: 14:00 - 16:00</span>
              </div>
              <div className="font-heading text-xl italic text-charcoal font-semibold">
                Khách đặt: Sophia Lorenz (2 Khách)
              </div>
            </div>

            <div className="flex gap-2 border-t border-stone/30 pt-4">
              <span className="px-3 py-1.5 bg-emerald-700 text-cream text-[9px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer">
                Xác Nhận Đơn
              </span>
              <span className="px-3 py-1.5 border border-stone text-ash text-[9px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer">
                Từ chối
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — STATS STRIP
      ════════════════════════════════════════════ */}
      <section
        id="stats"
        className="bg-lacquer relative overflow-hidden"
        style={{ paddingBlock: 'clamp(56px, 6vw, 90px)', paddingInline: 'clamp(20px, 5vw, 80px)' }}
      >
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-10" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0"
        >
          {[
            { value: 120, suffix: '+', label: bilingualContent.statsVillages },
            { value: 500, suffix: '+', label: bilingualContent.statsArtisans },
            { value: 1200, suffix: '+', label: bilingualContent.statsProducts },
            { value: 40, suffix: '', label: bilingualContent.statsProvinces },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center"
            >
              {i > 0 && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-cream/20 hidden md:block" />
              )}
              
              <span
                className="font-heading text-cream font-light"
                style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1 }}
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1.5}
                  className="font-heading text-cream font-light"
                />
              </span>
              <span className="font-sans text-cream/75 uppercase tracking-[0.15em] text-[11px] font-semibold mt-2.5">
                <LocaleText content={stat.label} />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8 — DIRECT REGISTRATION CTA
      ════════════════════════════════════════════ */}
      <section
        id="artisan-registration"
        className="bg-charcoal text-cream relative overflow-hidden"
        style={{
          paddingBlock: 'clamp(80px, 9vw, 140px)',
          paddingInline: 'clamp(20px, 5vw, 80px)',
          borderTop: '1px solid rgba(196, 149, 42, 0.2)',
        }}
      >
        {/* Subtle premium corner frames */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-gold/30" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-gold/30" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-gold/30" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-gold/30" />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-20" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center space-y-6 relative z-10"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold flex items-center gap-2">
              <span className="w-8 h-px bg-gold/50 block" />
              <LocaleText content={bilingualContent.ctaLabel} />
              <span className="w-8 h-px bg-gold/50 block" />
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-cream italic leading-tight"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            <LocaleText content={bilingualContent.ctaTitle} />
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans text-cream/70 leading-[1.8] max-w-xl mx-auto font-light"
            style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}
          >
            <LocaleText content={bilingualContent.ctaDesc} />
          </motion.p>

          <motion.div variants={fadeUp} className="pt-6">
            <Link href="/onboarding">
              <motion.span
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 bg-lacquer text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[12px] px-10 py-4.5 rounded-sm hover:brightness-110 shadow-lg cursor-pointer border border-lacquer/50 transition-all hover:scale-[1.02]"
              >
                <span><LocaleText content={bilingualContent.ctaButton} /></span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </motion.span>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-sans text-cream/40 text-[10px] uppercase tracking-[0.12em] pt-4"
          >
            <LocaleText content={bilingualContent.ctaFooter} />
          </motion.p>
        </motion.div>
      </section>

    </div>
  );
}
