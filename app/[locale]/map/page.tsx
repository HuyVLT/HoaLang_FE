'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Map as MapIcon,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import { SectionLabel, TagBadge, OrnamentDivider } from '@/components/shared';

// High-fidelity Mock data for traditional craft villages mapped across Vietnam
interface VillageMarker {
  slug: string;
  name: { vi: string; en: string };
  province: { vi: string; en: string };
  region: 'North' | 'Center' | 'South';
  categories: { vi: string[]; en: string[] };
  description: {
    vi: string;
    en: string;
  };
  coords: { x: number; y: number }; // Percentage offsets on our custom digital canvas
  coverImage: string;
  isVerified: boolean;
  history: {
    vi: string;
    en: string;
  };
}

const VILLAGES: VillageMarker[] = [
  {
    slug: 'bat-trang',
    name: { vi: 'Làng Gốm Bát Tràng', en: 'Bat Trang Pottery Village' },
    province: { vi: 'Hà Nội', en: 'Ha Noi' },
    region: 'North',
    categories: { vi: ['Gốm sứ', 'Đất nung', 'Thủ công'], en: ['Ceramics', 'Terracotta', 'Handicraft'] },
    description: {
      vi: 'Làng gốm cổ nằm bên dòng sông Hồng lịch sử, nổi tiếng với kỹ thuật xoay gốm thủ công bằng tay và các bài men cổ độc bản nung ở nhiệt độ cao củi lửa 1300°C.',
      en: 'An ancient pottery village nested along the Red River, renowned for handcrafted wheel-turning techniques and heritage wood-fired glaze styles.'
    },
    coords: { x: 34, y: 15 },
    coverImage: '/images/village-bat-trang.png',
    isVerified: true,
    history: {
      vi: 'Hình thành từ thời nhà Lý (thế kỷ XI), gốm sứ Bát Tràng từng là cống phẩm quý tiến vua và là thương phẩm vang danh khắp bến cảng Thăng Long cổ xưa.',
      en: 'Established during the Ly Dynasty (11th century), Bat Trang ceramics were precious tributes for emperors and famed trade commodities at the ancient Thang Long ports.'
    }
  },
  {
    slug: 'van-phuc',
    name: { vi: 'Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village' },
    province: { vi: 'Hà Nội', en: 'Ha Noi' },
    region: 'North',
    categories: { vi: ['Dệt lụa', 'Thêu thêu', 'Tơ tằm'], en: ['Silk Weaving', 'Embroidery', 'Mulberry Silk'] },
    description: {
      vi: 'Cái nôi của dòng lụa Vân lụa Hà Đông tơ tằm nguyên bản. Mềm, mịn, mát và đặc biệt có hoa văn chìm tinh xảo biến đổi óng ánh theo góc độ ánh sáng cực phẩm.',
      en: 'The cradle of premium Ha Dong mulberry silk. Famous for its soft, lustrous weight and subtle jacquard patterns that shimmer dynamically in daylight.'
    },
    coords: { x: 31, y: 18 },
    coverImage: '/images/village-van-phuc.png',
    isVerified: true,
    history: {
      vi: 'Hơn 1200 năm gìn giữ khung cửi dệt thủ công, lụa Vạn Phúc từng tham dự hội chợ quốc tế Marseille (1931) và được người Pháp đánh giá là đệ nhất tơ tằm Đông Dương.',
      en: 'With over 1200 years of handloom weaving history, Van Phuc silk debuted at the Marseille International Fair in 1931, praised by the French as the finest textile of Indochina.'
    }
  },
  {
    slug: 'dong-ho',
    name: { vi: 'Làng Tranh Đông Hồ', en: 'Dong Ho Folk Painting Village' },
    province: { vi: 'Bắc Ninh', en: 'Bac Ninh' },
    region: 'North',
    categories: { vi: ['Tranh dân gian', 'Giấy điệp', 'Bản khắc gỗ'], en: ['Folk Painting', 'Diep Paper', 'Woodblock Print'] },
    description: {
      vi: 'Nơi sản sinh ra các bức tranh khắc gỗ mộc mạc lưu truyền cốt cách hồn quê Việt Nam, in trên nền giấy điệp lấp lánh làm từ vỏ sò và màu sắc chiết xuất hoàn toàn thiên nhiên.',
      en: 'Home of rustic folk woodblock prints depicting Vietnamese agrarian soul, pressed onto shimmering scallop-shell Diep paper with completely organic plant-derived pigments.'
    },
    coords: { x: 38, y: 16 },
    coverImage: '/images/village-dong-ho.png',
    isVerified: true,
    history: {
      vi: 'Tranh Đông Hồ gắn liền với văn hóa Tết cổ truyền Kinh Bắc. Bản khắc gỗ dừa kết hợp với lá tre, rơm nếp mang lại vẻ đẹp thô mộc đặc trưng ngàn năm văn hiến.',
      en: 'Dong Ho prints are intrinsically tied to Lunar New Year festivals. Coconut woodblocks paired with bamboo leaf and rice-straw fibers yield a timeless, rustic heritage aesthetic.'
    }
  },
  {
    slug: 'non-nuoc',
    name: { vi: 'Làng Đá Non Nước', en: 'Non Nuoc Stone Carving Village' },
    province: { vi: 'Đà Nẵng', en: 'Da Nang' },
    region: 'Center',
    categories: { vi: ['Điêu khắc đá', 'Mỹ nghệ'], en: ['Stone Carving', 'Fine Crafts'] },
    description: {
      vi: 'Tọa lạc ngay dưới chân núi Ngũ Hành Sơn hùng vĩ, nổi tiếng với nghệ thuật chế tác đá cẩm thạch đỉnh cao từ tượng tâm linh cổ đến trang sức mỹ nghệ tinh tế.',
      en: 'Nestled at the foot of the Marble Mountains, famous for grand marble sculptures and exquisite hand-carved ornamental stone art.'
    },
    coords: { x: 50, y: 44 },
    coverImage: '/images/register_silk_bg.png', // Fallback high-fidelity asset
    isVerified: false,
    history: {
      vi: 'Thành lập vào thế kỷ XVII bởi nghệ nhân Huỳnh Bá Quát, thừa hưởng các di sản chạm khắc tháp Chàm tinh xảo hài hòa cùng mỹ thuật cung đình Huế.',
      en: 'Founded in the 17th century by master Huynh Ba Quat, blending intricate Champa relief styles with Nguyen royal court aesthetics.'
    }
  },
  {
    slug: 'thanh-ha',
    name: { vi: 'Làng Gốm Thanh Hà', en: 'Thanh Ha Pottery Village' },
    province: { vi: 'Quảng Nam', en: 'Quang Nam' },
    region: 'Center',
    categories: { vi: ['Gốm đất nung', 'Sản phẩm mộc'], en: ['Terracotta', 'Clay Crafts'] },
    description: {
      vi: 'Làng nghề ven dòng Thu Bồn êm đềm, nổi tiếng với các sản phẩm gốm mộc không tráng men mang màu cam đỏ gạch ấm áp, phản ánh tinh thần miền Trung đôn hậu.',
      en: 'A peaceful terracotta village on the Thu Bon riverbanks, specializing in unglazed, warm orange-red earthenware reflecting the resilient spirit of Central Vietnam.'
    },
    coords: { x: 52, y: 47 },
    coverImage: '/images/login_pottery_bg.png', // Fallback high-fidelity asset
    isVerified: true,
    history: {
      vi: 'Từng cung cấp gạch ngói xây dựng các biệt phủ cổ kính tại thương cảng Hội An xưa, gốm Thanh Hà lưu giữ kỹ thuật chuốt gốm bằng chân nhịp nhàng.',
      en: 'Once supplying tiles and pottery for old merchants villas in ancient Hoi An port, Thanh Ha preserves unique foot-pedal clay throwing steps.'
    }
  },
  {
    slug: 'phuoc-kieu',
    name: { vi: 'Làng Đúc Đồng Phước Kiều', en: 'Phuoc Kieu Bronze Casting Village' },
    province: { vi: 'Quảng Nam', en: 'Quang Nam' },
    region: 'Center',
    categories: { vi: ['Đúc đồng', 'Cồng chiêng'], en: ['Bronze Casting', 'Gongs & Bells'] },
    description: {
      vi: 'Vương quốc của những lò nung cồng chiêng, nhạc cụ, chuông đồng cổ xưa. Kỹ nghệ pha chế đồng độc quyền mang lại âm thanh trầm bổng đặc trưng cho văn hóa Tây Nguyên.',
      en: 'A sanctuary of sacred bronze gongs, temple bells, and royal bronze items. Renowned for custom metal alloys that create evocative spiritual sounds.'
    },
    coords: { x: 49, y: 50 },
    coverImage: '/images/village-van-phuc.png',
    isVerified: false,
    history: {
      vi: 'Với hơn 400 năm lịch sử đúc súng thần công, khánh đồng triều Nguyễn, nghệ nhân Phước Kiều nổi danh cả nước về kỹ thuật tinh tai thẩm định âm thanh cồng chiêng.',
      en: 'With 400+ years casting cannons and royal bells for the Nguyen dynasty, Phuoc Kieu masters are legendary nationwide for acoustic tuning of ritual bronze gongs.'
    }
  }
];

export default function InteractiveMapPage() {
  const locale = useLocale() as 'vi' | 'en';
  const [selectedVillage, setSelectedVillage] = useState<VillageMarker | null>(VILLAGES[0]);
  const [currentRegionFilter, setCurrentRegionFilter] = useState<'All' | 'North' | 'Center'>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 2));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 1));
      if (zoomLevel <= 1.25) setMapOffset({ x: 0, y: 0 });
    }
  };

  const filteredVillages = currentRegionFilter === 'All' 
    ? VILLAGES 
    : VILLAGES.filter(v => v.region === currentRegionFilter);

  const t = {
    title: locale === 'vi' ? 'Bản Đồ Di Sản Làng Nghề' : 'Heritage Craft Villages Atlas',
    subTitle: locale === 'vi' ? 'Số hóa 3D & khảo sát các làng nghề văn hóa truyền thống Việt Nam' : '3D interactive scanning and location audit of traditional Vietnamese craft villages',
    filterAll: locale === 'vi' ? 'Tất cả' : 'All Regions',
    filterNorth: locale === 'vi' ? 'Miền Bắc' : 'Northern Vietnam',
    filterCenter: locale === 'vi' ? 'Miền Trung' : 'Central Vietnam',
    exploreBtn: locale === 'vi' ? 'Truy Cập Hệ Thống Website Làng' : 'Enter Village Portal',
    verified: locale === 'vi' ? 'Đã Kiểm Định' : 'HoaLang Certified',
    historyLabel: locale === 'vi' ? 'Biên Niên Sử Làng Nghề' : 'Village Chronicle & History',
    craftLabel: locale === 'vi' ? 'Loại nghề' : 'Craft Type',
    metaTitle: locale === 'vi' ? 'Khảo Sát Bản Đồ Thực Địa' : 'Visual Mapping System',
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col relative select-none overflow-hidden">
      {/* Organic Grain texture overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-10" />

      {/* Main Fullscreen Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row h-full relative z-0">
        
        {/* Left Side: Map Container */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-8 min-h-[500px] lg:min-h-0 bg-cream/30">
          
          {/* Subtle gold grid guidelines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] pointer-events-none border border-gold/10">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-gold/15" />
            ))}
          </div>

          {/* Floating Atlas Header Panel */}
          <div className="absolute top-6 left-6 z-20 max-w-sm text-left bg-cream/90 backdrop-blur-md border border-stone p-5 rounded-sm shadow-sm">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-gold block mb-1">
              {t.metaTitle}
            </span>
            <h1 className="font-heading text-2xl font-bold italic text-charcoal tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="font-sans text-[11px] text-ash font-light leading-relaxed mt-1">
              {t.subTitle}
            </p>

            {/* Quick Regional Filters */}
            <div className="flex gap-2 mt-4 border-t border-stone/30 pt-3">
              {(['All', 'North', 'Center'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setCurrentRegionFilter(filter)}
                  className={`text-[9px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1.5 border rounded-xs transition-all ${
                    currentRegionFilter === filter
                      ? 'bg-lacquer border-lacquer text-cream'
                      : 'bg-transparent border-stone/50 text-ash hover:border-bronze'
                  }`}
                >
                  {filter === 'All' ? t.filterAll : filter === 'North' ? t.filterNorth : t.filterCenter}
                </button>
              ))}
            </div>
          </div>

          {/* Map Interaction Toolbar */}
          <div className="absolute bottom-6 left-6 z-20 flex gap-2">
            <button
              onClick={() => handleZoom('in')}
              className="w-9 h-9 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="w-9 h-9 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="px-3 bg-cream/95 backdrop-blur-md border border-stone flex items-center text-[10px] font-sans font-bold uppercase tracking-wider text-ash rounded-sm shadow-sm select-none">
              Zoom: {zoomLevel * 100}%
            </div>
          </div>

          {/* Interactive Geographic S-Shape Vietnam Canvas */}
          <div
            className="w-full max-w-[480px] aspect-[9/16] relative transition-transform duration-500 ease-out flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            }}
          >
            {/* Elegant Background SVG outline of Vietnam map */}
            <svg
              className="w-full h-full text-stone/20 fill-current drop-shadow-[0_8px_24px_rgba(26,18,8,0.06)]"
              viewBox="0 0 200 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Abstract editorial representations of North/Center regions */}
              <path
                d="M 50,20 C 60,18 78,25 78,35 C 78,45 68,52 64,58 C 60,64 62,70 65,76 C 68,82 72,90 70,95 C 68,100 62,108 65,115 C 68,122 84,138 88,144 C 92,150 96,162 98,170 C 100,178 106,190 102,198 C 98,206 102,216 106,220 C 110,224 116,236 112,242 C 108,248 114,258 118,264"
                stroke="var(--color-stone)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 4"
                className="text-stone/60"
              />
              <path
                d="M 52,24 C 62,22 75,28 75,37 C 75,46 66,50 62,56 C 58,62 60,68 63,74 C 66,80 70,88 68,93 C 66,98 60,105 63,112 C 66,119 82,135 86,141 C 90,147 94,159 96,167 C 98,175 104,187 100,195 C 96,203 100,213 104,217 C 108,221 114,233 110,239"
                stroke="#C4952A"
                strokeWidth="0.75"
                fill="none"
                className="opacity-40"
              />

              {/* Dynamic geographic zones outlines */}
              <g className="text-stone/30 opacity-80 font-heading text-[10px] italic">
                <text x="30" y="50" fill="currentColor">Kinh Bắc</text>
                <text x="36" y="90" fill="currentColor">Thăng Long</text>
                <text x="68" y="195" fill="currentColor">Thu Bồn</text>
              </g>
            </svg>

            {/* Glowing Map pins */}
            {filteredVillages.map(v => {
              const isSelected = selectedVillage?.slug === v.slug;
              return (
                <button
                  key={v.slug}
                  onClick={() => setSelectedVillage(v)}
                  className="absolute group z-30 transition-transform duration-300"
                  style={{
                    left: `${v.coords.x}%`,
                    top: `${v.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ring pulsations */}
                    <span className={`absolute inline-flex h-10 w-10 rounded-full opacity-60 transition-all ${
                      isSelected ? 'animate-ping bg-lacquer/30' : 'group-hover:animate-ping bg-gold/20'
                    }`} />
                    
                    {/* Solid marker center */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-md ${
                      isSelected
                        ? 'bg-lacquer border-lacquer text-cream scale-110 shadow-lg'
                        : 'bg-cream border-stone text-gold group-hover:border-bronze group-hover:scale-105'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                    </div>

                    {/* Minimal hover label */}
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-charcoal text-cream text-[9px] font-sans uppercase tracking-widest font-semibold px-2 py-0.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm z-50">
                      {v.name[locale]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Editorial Info Side Drawer */}
        <div className="w-full lg:w-[440px] border-t lg:border-t-0 lg:border-l border-stone/50 bg-cream/95 backdrop-blur-md flex flex-col justify-between relative shadow-2xl z-10 text-left">
          <AnimatePresence mode="wait">
            {selectedVillage ? (
              <motion.div
                key={selectedVillage.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* Upper Scrollable Info Content */}
                <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                  
                  {/* Village Cover Image aspect-ratio 4/3 */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-stone rounded-sm bg-stone/20">
                    <img
                      src={selectedVillage.coverImage}
                      alt={selectedVillage.name[locale]}
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Floating verified state */}
                    {selectedVillage.isVerified && (
                      <div className="absolute top-3 left-3 bg-cream/95 backdrop-blur-xs border border-gold/40 px-2 py-0.5 rounded-xs shadow-xs select-none">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1 font-sans">
                          ✦ {t.verified}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Province & Header */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ash font-sans block">
                      {selectedVillage.province[locale]} • {selectedVillage.region === 'North' ? t.filterNorth : t.filterCenter}
                    </span>
                    <h2 className="font-heading text-3xl font-bold italic text-charcoal leading-tight">
                      {selectedVillage.name[locale]}
                    </h2>
                  </div>

                  <OrnamentDivider className="text-stone/30" />

                  {/* Story Description */}
                  <div className="space-y-3">
                    <p className="font-sans text-xs text-ash leading-relaxed font-light">
                      {selectedVillage.description[locale]}
                    </p>
                  </div>

                  {/* Craft types badges */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                      {t.craftLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVillage.categories[locale].map(cat => (
                        <TagBadge key={cat} label={cat} variant="stone" />
                      ))}
                    </div>
                  </div>

                  {/* Chronicle History block */}
                  <div className="bg-parchment/60 border border-stone/50 p-4 rounded-xs relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                      <Compass className="w-16 h-16 text-lacquer" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-lacquer block mb-1">
                      {t.historyLabel}
                    </span>
                    <p className="font-sans text-[11px] text-ash/90 leading-relaxed font-light italic">
                      {selectedVillage.history[locale]}
                    </p>
                  </div>
                </div>

                {/* Footer Dynamic CTA Button */}
                <div className="p-6 border-t border-stone/30 bg-cream">
                  <Link
                    href={`/tenant/${selectedVillage.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[12px] py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>{t.exploreBtn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-ash space-y-3">
                <Info className="w-8 h-8 text-stone/50" />
                <p className="font-sans text-xs font-light">
                  {locale === 'vi' ? 'Hãy nhấp chọn một dấu vị trí trên bản đồ để xem chi tiết lịch sử làng nghề.' : 'Please click a marker pin on the map to explore the craft village details.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
