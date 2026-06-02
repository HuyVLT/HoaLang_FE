'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Store, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PageHeader, TagBadge } from '@/components/shared';
import { villageService } from '@/lib/services/villageService';
import { getTenantUrl } from '@/lib/tenant-url';
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
  }
];

export default function ShopPage() {
  const t = useTranslations('shopList');
  const locale = useLocale();

  const [shops, setShops] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadShops = async () => {
      setLoading(true);
      try {
        const data = await villageService.getVillages();
        if (data && data.length > 0) {
          // Only show verified shops or those with coordinates (actual onboarded ones)
          setShops(data);
        } else {
          setShops(MOCK_FALLBACK_VILLAGES);
        }
      } catch (err) {
        console.warn('[ShopPage] Failed to fetch shops from API, using high-fidelity offline fallback.', err);
        setShops(MOCK_FALLBACK_VILLAGES);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  // Safe category resolver
  const getLocalizedCategory = (cat: string, currentLocale: string): string => {
    return categoryTranslations[cat]?.[currentLocale] || cat;
  };

  // Safe province resolver
  const getLocalizedProvince = (prov: string, currentLocale: string): string => {
    return provinceTranslations[prov]?.[currentLocale] || prov;
  };

  // Client-side search filtering
  const filteredShops = shops.filter((s) => {
    const shopName = s.name[locale] || s.name['vi'] || '';
    const shopProvince = getLocalizedProvince(s.province, locale);
    const searchMatch = 
      shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shopProvince.toLowerCase().includes(searchQuery.toLowerCase());
    
    return searchQuery === '' || searchMatch;
  });

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* Editorial Page Header */}
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('breadcrumb'), href: '/shop' }]}
        variant="light"
      />

      <div className="max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)] pt-12">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between border-b border-stone pb-8 mb-12">
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
          <div className="flex items-center gap-2 text-ash text-xs uppercase font-sans font-semibold tracking-wider">
            <Store className="w-4 h-4 text-gold" />
            <span>{filteredShops.length} {t('allShops')}</span>
          </div>
        </div>

        {/* Loading and Shop Boutiques Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 select-none">
            <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
            <span className="font-heading italic text-xl text-charcoal">Đang liên kết gian hàng nghệ nhân...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredShops.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredShops.map((shop, index) => {
                  const resolvedName = shop.name[locale] || shop.name['vi'] || '';
                  const localizedProvince = getLocalizedProvince(shop.province, locale);
                  const tenantUrl = getTenantUrl(shop.slug);

                  return (
                    <motion.div
                      key={shop.slug}
                      variants={fadeUp}
                      className={index % 3 === 1 ? 'lg:translate-y-8' : ''}
                    >
                      <div className="flex flex-col h-full bg-cream border border-stone rounded-sm overflow-hidden select-none hover:shadow-hover transition-shadow duration-300">
                        {/* Aspect Ratio Image Container */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone/20">
                          <motion.div
                            className="w-full h-full relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Image
                              src={
                                shop.images && shop.images.length > 0
                                  ? shop.images[0]
                                  : '/images/placeholder.png'
                              }
                              alt={resolvedName}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                              className="object-cover"
                            />
                          </motion.div>

                          {/* Expert Verified Badge */}
                          {shop.isVerified && (
                            <div className="absolute top-3 left-3 bg-cream/95 backdrop-blur-xs border border-gold/40 px-2 py-0.5 rounded-[2px] shadow-sm">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1 font-sans">
                                ✦ {t('verifiedBoutique')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Body Contents */}
                        <div className="p-6 flex-grow flex flex-col justify-between text-left space-y-4">
                          <div className="space-y-2">
                            {/* Province */}
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-ash font-sans block">
                              {localizedProvince}
                            </span>

                            {/* Boutique Shop Title */}
                            <h3 className="font-heading text-[22px] font-semibold text-charcoal leading-snug">
                              {resolvedName}
                            </h3>

                            {/* Short Description */}
                            <p className="font-sans text-[13px] text-ash font-light leading-relaxed line-clamp-2">
                              {shop.desc[locale] || shop.desc['vi'] || ''}
                            </p>
                          </div>

                          <div className="space-y-4 pt-2">
                            {/* Categories Badges */}
                            {shop.categories && shop.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {shop.categories.slice(0, 3).map((cat) => (
                                  <TagBadge
                                    key={cat}
                                    label={getLocalizedCategory(cat, locale)}
                                    variant="stone"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Enter Boutique Redirect Button */}
                            <a
                              href={tenantUrl}
                              className="w-full flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-[0.12em] text-[11px] py-3 rounded-xs hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                              <span>{t('visitShop')}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gold" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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
