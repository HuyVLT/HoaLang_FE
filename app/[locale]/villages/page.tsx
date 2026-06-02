'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass } from 'lucide-react';
import { PageHeader, VillageCard } from '@/components/shared';
import { villageService } from '@/lib/services/villageService';
import { Village } from '@/types/village';

// Staggered reveal animations matching GEMINI.md
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  },
};

const stagger = {
  visible: { 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  },
};

// Localized translation lookups for categories and provinces returned from DB
const categoryTranslations: Record<string, Record<string, string>> = {
  'Gốm sứ': { vi: 'Gốm sứ', en: 'Ceramics', ja: '陶磁器', ko: '도자기', zh: '陶瓷' },
  'Đất nung': { vi: 'Đất nung', en: 'Terracotta', ja: 'テラコッタ', ko: '테라코타', zh: '红陶' },
  'Thủ công': { vi: 'Thủ công', en: 'Handicraft', ja: '手芸', ko: '수공예', zh: '手工艺' },
  'Dệt lụa': { vi: 'Dệt lụa', en: 'Silk Weaving', ja: '絹織物', ko: '실크 직조', zh: '丝绸织造' },
  'Thời trang': { vi: 'Thời trang', en: 'Fashion', ja: 'ファッション', ko: '패션', zh: '时尚' },
  'Thổ cẩm': { vi: 'Thổ cẩm', en: 'Brocade', ja: 'ブロケード', ko: '브로케이드', zh: '织锦' },
  'Đá mỹ nghệ': { vi: 'Đá mỹ nghệ', en: 'Stone Carving', ja: '石彫', ko: '석조', zh: '石雕' },
  'Điêu khắc': { vi: 'Điêu khắc', en: 'Sculpture', ja: '彫刻', ko: '조각', zh: '雕刻' },
  'Lưu niệm': { vi: 'Lưu niệm', en: 'Souvenirs', ja: 'お土産', ko: '기념품', zh: '纪念品' },
  'Đồ gia dụng': { vi: 'Đồ gia dụng', en: 'Homeware', ja: '家庭用品', ko: '가정용품', zh: '家居用品' },
  'Nghệ thuật trang trí': { vi: 'Nghệ thuật trang trí', en: 'Decorative Art', ja: '装飾美術', ko: '장식 미술', zh: '装饰艺术' },
  'Tranh dân gian': { vi: 'Tranh dân gian', en: 'Folk Painting', ja: '民俗版画', ko: '민화', zh: '民间画' },
  'Giấy điệp': { vi: 'Giấy điệp', en: 'Diep Paper', ja: 'ジエップ紙', ko: '디엡 종이', zh: '迭纸' }
};

const provinceTranslations: Record<string, Record<string, string>> = {
  'Hà Nội': { vi: 'Hà Nội', en: 'Ha Noi', ja: 'ハノイ', ko: '하노이', zh: '河内' },
  'Hà Nội (Hà Đông)': { vi: 'Hà Nội (Hà Đông)', en: 'Ha Noi (Ha Dong)', ja: 'ハノイ (ハドン)', ko: '하노이 (하동)', zh: '河内 (河东)' },
  'Đà Nẵng': { vi: 'Đà Nẵng', en: 'Da Nang', ja: 'ダナン', ko: '다낭', zh: '岘港' },
  'Bắc Ninh': { vi: 'Bắc Ninh', en: 'Bac Ninh', ja: 'バクニン', ko: '박닌', zh: '北宁' },
  'Quảng Nam': { vi: 'Quảng Nam', en: 'Quang Nam', ja: 'クアンナム', ko: '광남', zh: '广南' }
};

// High-fidelity fallback data matching backend seed models
const MOCK_FALLBACK_VILLAGES: Village[] = [
  {
    slug: 'bat-trang',
    name: { vi: 'Làng Gốm Bát Tràng', en: 'Bat Trang Pottery Village', ja: 'バッチャン陶芸村', ko: '밧짱 도자기 마을', zh: '八场陶瓷村' },
    desc: {
      vi: 'Làng gốm Bát Tràng nằm bên bờ sông Hồng, cách trung tâm Hà Nội 13km. Với hơn 700 năm lịch sử, nơi đây là cái nôi của nghệ thuật gốm sứ Việt Nam.',
      en: 'Bat Trang Pottery Village sits along the Red River banks, 13km from Hanoi. With over 700 years of history, it is the cradle of Vietnamese ceramics.'
    },
    province: 'Hà Nội',
    location: { type: 'Point', coordinates: [105.9025, 20.9934] },
    categories: ['Gốm sứ', 'Đồ gia dụng', 'Nghệ thuật trang trí'],
    images: ['/images/village-bat-trang.png'],
    isVerified: true
  },
  {
    slug: 'van-phuc',
    name: { vi: 'Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village', ja: 'ヴァンフック絹村', ko: '반푹 실크 마을', zh: '万福丝绸村' },
    desc: {
      vi: 'Làng lụa Vạn Phúc nổi tiếng với những tấm lụa tơ tằm mềm mại, màu sắc bền đẹp và hoa văn tinh xảo.',
      en: 'Van Phuc Silk Village is famous for soft mulberry silk sheets, durable colors, and sophisticated weaving.'
    },
    province: 'Hà Nội (Hà Đông)',
    location: { type: 'Point', coordinates: [105.7731, 20.9689] },
    categories: ['Dệt lụa', 'Thời trang', 'Thổ cẩm'],
    images: ['/images/village-van-phuc.png'],
    isVerified: true
  },
  {
    slug: 'non-nuoc',
    name: { vi: 'Làng Đá Mỹ Nghệ Non Nước', en: 'Non Nuoc Stone Carving Village', ja: 'ノンヌック石彫村', ko: '논눅 석조 마을', zh: '五行山石雕村' },
    desc: {
      vi: 'Nằm dưới chân núi Ngũ Hành Sơn, làng đá Non Nước nổi tiếng với các sản phẩm điêu khắc đá cẩm thạch tinh xảo.',
      en: 'Located at the foot of Marble Mountains, Non Nuoc is famous for exquisite marble sculptures.'
    },
    province: 'Đà Nẵng',
    location: { type: 'Point', coordinates: [108.2648, 16.0217] },
    categories: ['Đá mỹ nghệ', 'Điêu khắc', 'Lưu niệm'],
    images: ['/images/register_silk_bg.png'],
    isVerified: true
  },
  {
    slug: 'dong-ho',
    name: { vi: 'Làng Tranh Đông Hồ', en: 'Dong Ho Folk Painting Village', ja: 'ドンホー民俗版画村', ko: '동호 민화 마을', zh: '东湖民间画村' },
    desc: {
      vi: 'Nơi sản sinh ra các bức tranh khắc gỗ mộc mạc in trên nền giấy điệp tự nhiên lấp lánh.',
      en: 'Home of rustic folk woodblock prints pressed onto natural shimmering Diep paper.'
    },
    province: 'Bắc Ninh',
    location: { type: 'Point', coordinates: [106.0744, 21.0967] },
    categories: ['Tranh dân gian', 'Giấy điệp'],
    images: ['/images/village-dong-ho.png'],
    isVerified: false
  }
];

export default function VillagesPage() {
  const t = useTranslations('villagesList');
  const locale = useLocale();

  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    const loadVillages = async () => {
      setLoading(true);
      try {
        const data = await villageService.getVillages();
        if (data && data.length > 0) {
          setVillages(data);
        } else {
          // Fallback to high-fidelity mock data if database is empty
          setVillages(MOCK_FALLBACK_VILLAGES);
        }
      } catch (err) {
        console.warn('[VillagesPage] Failed to fetch villages from API, using high-fidelity offline fallback.', err);
        setVillages(MOCK_FALLBACK_VILLAGES);
      } finally {
        setLoading(false);
      }
    };

    loadVillages();
  }, []);

  // Safe category resolver
  const getLocalizedCategory = (cat: string, currentLocale: string): string => {
    return categoryTranslations[cat]?.[currentLocale] || cat;
  };

  // Safe province resolver
  const getLocalizedProvince = (prov: string, currentLocale: string): string => {
    return provinceTranslations[prov]?.[currentLocale] || prov;
  };

  // Filter choices
  const filterCategories = [
    { value: 'all', label: t('allCategories') },
    { value: 'Gốm sứ', label: getLocalizedCategory('Gốm sứ', locale) },
    { value: 'Dệt lụa', label: getLocalizedCategory('Dệt lụa', locale) },
    { value: 'Đá mỹ nghệ', label: getLocalizedCategory('Đá mỹ nghệ', locale) },
    { value: 'Tranh dân gian', label: getLocalizedCategory('Tranh dân gian', locale) },
    { value: 'Đúc đồng', label: getLocalizedCategory('Đúc đồng', locale) }
  ];

  const filterProvinces = [
    { value: 'all', label: t('allProvinces') },
    { value: 'Hà Nội', label: getLocalizedProvince('Hà Nội', locale) },
    { value: 'Hà Nội (Hà Đông)', label: getLocalizedProvince('Hà Nội (Hà Đông)', locale) },
    { value: 'Đà Nẵng', label: getLocalizedProvince('Đà Nẵng', locale) },
    { value: 'Bắc Ninh', label: getLocalizedProvince('Bắc Ninh', locale) },
    { value: 'Quảng Nam', label: getLocalizedProvince('Quảng Nam', locale) }
  ];

  // Client-side filtering logic based on user inputs
  const filteredVillages = villages.filter((v) => {
    const nameMatch = (v.name[locale] || v.name['vi'] || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const provinceMatch = getLocalizedProvince(v.province, locale)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const searchMatch = nameMatch || provinceMatch;

    const matchesSearch = searchQuery === '' || searchMatch;

    const matchesProvince =
      selectedProvince === 'all' ||
      v.province === selectedProvince ||
      (selectedProvince === 'Hà Nội' && v.province.includes('Hà Nội'));

    const matchesCategory =
      selectedCategory === 'all' ||
      v.categories.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      );

    const matchesVerified = !verifiedOnly || v.isVerified;

    return matchesSearch && matchesProvince && matchesCategory && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* Editorial Page Header */}
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('breadcrumb'), href: '/villages' }]}
        variant="light"
      />

      <div className="max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)] pt-12">
        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between border-b border-stone pb-8 mb-12">
          {/* Left: Premium text input with Search icon */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-stone py-2.5 pl-10 pr-4 text-charcoal placeholder:text-ash font-sans text-sm focus:border-bronze focus:outline-none transition-colors"
            />
          </div>

          {/* Right: Dropdowns & Luxury checkbox */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category selection */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-cream border border-stone/80 px-4 py-2.5 text-charcoal font-sans text-xs font-semibold uppercase tracking-wider rounded-xs focus:border-bronze focus:outline-none transition-colors appearance-none pr-9 cursor-pointer select-none"
              >
                {filterCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-b border-r border-charcoal/60 transform rotate-45 -translate-y-1" />
            </div>

            {/* Province selection */}
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-cream border border-stone/80 px-4 py-2.5 text-charcoal font-sans text-xs font-semibold uppercase tracking-wider rounded-xs focus:border-bronze focus:outline-none transition-colors appearance-none pr-9 cursor-pointer select-none"
              >
                {filterProvinces.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-b border-r border-charcoal/60 transform rotate-45 -translate-y-1" />
            </div>

            {/* Verified Only filter */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none py-2 px-1">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 border border-stone rounded-xs bg-cream flex items-center justify-center transition-all peer-checked:border-lacquer peer-checked:bg-lacquer">
                {verifiedOnly && <span className="text-[10px] text-cream leading-none font-bold">✦</span>}
              </div>
              <span className="font-sans text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                {t('filterVerified')}
              </span>
            </label>
          </div>
        </div>

        {/* Loading and Results section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 select-none">
            <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
            <span className="font-heading italic text-xl text-charcoal">Đang kết nối hành trình di sản...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredVillages.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              >
                {filteredVillages.map((village, index) => (
                  <motion.div
                    key={village.slug}
                    variants={fadeUp}
                    className={index % 3 === 1 ? 'lg:translate-y-8' : ''}
                  >
                    <VillageCard
                      slug={village.slug}
                      name={village.name}
                      province={getLocalizedProvince(village.province, locale)}
                      categories={village.categories.map((cat) =>
                        getLocalizedCategory(cat, locale)
                      )}
                      coverImage={
                        village.images && village.images.length > 0
                          ? village.images[0]
                          : '/images/placeholder.png'
                      }
                      isVerified={village.isVerified}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-cream/50 border border-stone/50 rounded-sm"
              >
                <p className="font-heading italic text-xl text-ash max-w-md mx-auto leading-relaxed">
                  {t('noResults')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
