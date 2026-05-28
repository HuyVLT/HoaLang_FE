'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import {
  Sparkles,
  Calendar,
  Compass,
  MapPin,
  Coffee,
  Car,
  ChevronRight,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { SectionLabel, OrnamentDivider, TagBadge } from '@/components/shared';

// High-fidelity structured mock itineraries mapped to combinations
interface ItineraryStep {
  time: string;
  activity: { vi: string; en: string };
  location: { vi: string; en: string };
  desc: { vi: string; en: string };
  icon: 'craft' | 'food' | 'transport' | 'culture';
}

interface ItineraryDay {
  dayNum: number;
  focus: { vi: string; en: string };
  steps: ItineraryStep[];
}

interface SimulatedItinerary {
  id: string;
  title: { vi: string; en: string };
  region: 'North' | 'Center';
  duration: number;
  style: string;
  budget: string;
  days: ItineraryDay[];
}

const ITINERARIES: SimulatedItinerary[] = [
  {
    id: 'north-ceramics-silk',
    title: { vi: 'Hành Trình Di Sản Kinh Kỳ: Gốm Sông Hồng & Lụa Hà Đông', en: 'Capital Heritage: Red River Clay & Ha Dong Silk Road' },
    region: 'North',
    duration: 2,
    style: 'workshop',
    budget: 'luxury',
    days: [
      {
        dayNum: 1,
        focus: { vi: 'Tạo tác Đất sét Sông Hồng & Men Ngọc Bát Tràng', en: 'Red River Terracotta & Bat Trang Celadon Glazes' },
        steps: [
          {
            time: '08:30',
            activity: { vi: 'Di chuyển bằng xe Limousine riêng qua đê Sông Hồng', en: 'Private Limousine transfer along the Red River dike' },
            location: { vi: 'Hà Nội → Bát Tràng', en: 'Ha Noi → Bat Trang' },
            desc: {
              vi: 'Xe đưa đón đón khách tận nơi, di chuyển dọc đê hữu ngạn sông Hồng cổ kính, ngắm nhìn phong cảnh làng quê ven đô bình yên.',
              en: 'Private luxury transfer taking you along the historic Red River dikes, viewing scenic suburban farmlands.'
            },
            icon: 'transport'
          },
          {
            time: '09:30',
            activity: { vi: 'Khảo sát Lò Bầu cổ thế kỷ XIX & Xoay gốm bàn tay', en: '19th-Century Ancient Bau Kiln tour & Masterclass wheel-throwing' },
            location: { vi: 'Lò Gốm Cổ Bát Tràng', en: 'Bat Trang Ancient Kiln space' },
            desc: {
              vi: 'Khám phá kiến trúc lò bầu duy nhất còn sót lại, trải nghiệm tự xoay đất sét thô trên bàn xoay gốm truyền thống cùng nghệ nhân ưu tú.',
              en: 'Explore the last remaining classic multi-chamber oven, learning hand-thrown clay forming directly with a grandmaster artisan.'
            },
            icon: 'craft'
          },
          {
            time: '12:30',
            activity: { vi: 'Thưởng thức Ẩm thực ẩm đất nung: Canh măng mực cổ truyền', en: 'Taste Ancient Claypot Gastronomy: Squid & Bamboo shoot soup' },
            location: { vi: 'Nhà Cổ Nghệ Nhân Bát Tràng', en: 'Heritage House Dining space' },
            desc: {
              vi: 'Ăn trưa mâm cỗ truyền thống Bát Tràng gồm Canh măng mực tinh xảo và xôi vò hạt sen thơm bùi trứ danh vùng Kinh Bắc.',
              en: 'Enjoy a legendary Bat Trang traditional banquet, featuring fine squid bamboo-shoot soup and sweet lotus-seed sticky rice.'
            },
            icon: 'food'
          },
          {
            time: '14:30',
            activity: { vi: 'Khảo cứu men cổ & Tráng men bình ngọc', en: 'Heritage glaze glazing & vase coloring experience' },
            location: { vi: 'Gian hàng Gốm Nghệ Thuật', en: 'Artistic Ceramics Studio' },
            desc: {
              vi: 'Trực tiếp vẽ và tráng men ngọc bích cổ lên bình gốm đã tạo tác. Bình sẽ được nung lò củi và vận chuyển trực tiếp về nhà bạn.',
              en: 'Color and paint emerald glaze styles onto your pottery vase. The piece will be wood-fired and shipped directly to your residence.'
            },
            icon: 'craft'
          }
        ]
      },
      {
        dayNum: 2,
        focus: { vi: 'Dệt Lụa Vân Cổ & Thêu Tay Mỹ Nghệ Vạn Phúc', en: 'Woven Van Silk Weaving & Hand-Embroidery at Van Phuc' },
        steps: [
          {
            time: '09:00',
            activity: { vi: 'Khám phá phố Lụa Vạn Phúc rực rỡ sắc màu', en: 'Explore the vibrant colors of Van Phuc Silk pathways' },
            location: { vi: 'Cổng Làng Lụa Vạn Phúc', en: 'Van Phuc Silk Village entrance' },
            desc: {
              vi: 'Tản bộ qua các con phố rợp bóng ô lụa sắc màu, check-in lưu niệm và nghe giới thiệu về lịch sử đệ nhất tơ tằm xứ Hà Đông.',
              en: 'Stroll down lanes shaded by colorful silk umbrellas, hearing stories of the finest mulberry silk heritage of northern capital.'
            },
            icon: 'culture'
          },
          {
            time: '10:00',
            activity: { vi: 'Học dệt lụa tơ tằm cổ trên khung cửi 1200 năm tuổi', en: 'Mulberry silk handloom weaving at a 1200-year atelier' },
            location: { vi: 'Xưởng Dệt Nghệ Nhân Triệu Văn Mão', en: 'Master Weaving Studio' },
            desc: {
              vi: 'Trải nghiệm luồn thoi dệt lụa Vân tơ tằm nguyên bản trên hệ thống khung cửi gỗ cổ truyền, cảm nhận độ óng ánh của từng sợi tơ tự nhiên.',
              en: 'Try operating the wooden handlooms to weave lustrous classic Van jacquard silk, touching natural organic silk fibers.'
            },
            icon: 'craft'
          },
          {
            time: '12:30',
            activity: { vi: 'Thưởng trà mộc sen và dùng trưa ẩm thực đồng nội', en: 'Lotus green tea tasting & traditional countryside lunch' },
            location: { vi: 'Vườn Trà Sen Đình Làng', en: 'Communal Tea Garden' },
            desc: {
              vi: 'Thưởng thức trà sen Tây Hồ ủ nhị hoa mộc mạc cùng các món ăn đồng quê như Bún chả kẹp que tre nướng than hoa thơm lừng.',
              en: 'Savor organic green tea infused with West Lake lotus petals, paired with traditional charcoal-grilled pork patties on bamboo skewers.'
            },
            icon: 'food'
          }
        ]
      }
    ]
  },
  {
    id: 'north-folk-paint',
    title: { vi: 'Khảo Cổ Kinh Bắc: Tranh Dân Gian Đông Hồ & Giấy Điệp', en: 'Ancient Kinh Bac: Folk Paintings & Shimmering Diep Paper' },
    region: 'North',
    duration: 1,
    style: 'explore',
    budget: 'budget',
    days: [
      {
        dayNum: 1,
        focus: { vi: 'Nghệ Thuật Bản Khắc Gỗ Cổ & Giấy Điệp Đông Hồ', en: 'Woodblock Carving & Shimmering Scallop-shell Paper' },
        steps: [
          {
            time: '08:00',
            activity: { vi: 'Đón xe máy Phượt thực địa về miền Kinh Bắc', en: 'Ride a motorbike tour to historic Kinh Bac province' },
            location: { vi: 'Hà Nội → Thuận Thành, Bắc Ninh', en: 'Ha Noi → Thuan Thanh, Bac Ninh' },
            desc: {
              vi: 'Trải nghiệm di chuyển bằng xe máy ngắm cảnh làng quê thanh bình, qua sông Đuống thơ mộng đi vào thủ phủ tranh xưa.',
              en: 'Experience a scenic country ride, crossing the peaceful Duong River towards the historic folk print capital.'
            },
            icon: 'transport'
          },
          {
            time: '09:30',
            activity: { vi: 'Khảo sát kỹ nghệ quét giấy điệp & in tranh khắc gỗ', en: 'Masterclass: coloring Diep paper & pressing woodblocks' },
            location: { vi: 'Nhà Lưu Niệm Nghệ Nhân Nguyễn Đăng Chế', en: 'Nguyen Dang Che Folk Museum' },
            desc: {
              vi: 'Trải nghiệm giã vỏ sò điệp trộn hồ nếp, dùng chổi thông quét lên giấy dó để tạo độ lấp lánh óng ánh kỳ diệu cho nền tranh.',
              en: 'Learn to mix crushed scallop-shells with sticky rice paste, sweeping it onto organic Do paper to make shimmering sheets.'
            },
            icon: 'craft'
          },
          {
            time: '12:00',
            activity: { vi: 'Thịt gà muối luộc Kinh Bắc & Bánh phu thê Đình Bảng', en: 'Kinh Bac local banquet & classic husband-and-wife sweet cake' },
            location: { vi: 'Ẩm thực Đình Làng cổ', en: 'Communal Traditional Inn' },
            desc: {
              vi: 'Dùng cơm trưa mộc mạc vùng Quan họ với gà đồi hấp lá chanh thơm ngọt và tráng miệng bằng bánh phu thê gói lá dong.',
              en: 'Enjoy rustic local dishes like free-range steamed lime-leaf chicken, topped with classic leaf-wrapped Phu The cakes.'
            },
            icon: 'food'
          },
          {
            time: '14:00',
            activity: { vi: 'Chế tác tranh khắc gỗ dân gian: Đàn Lợn, Vinh Hoa', en: 'Press your own prints: Pig Family & Vinh Hoa motifs' },
            location: { vi: 'Xưởng in gỗ bản cổ truyền', en: 'Historic Printing Atelier' },
            desc: {
              vi: 'Trực tiếp đặt bản khắc gỗ dừa cổ lên giấy, dùng xơ mướp xoa đều sơn mài tự nhiên (đỏ son, vàng hòe, đen than lá tre) để hoàn tất bức tranh của riêng bạn.',
              en: 'Place original pearwood blocks onto paper, using dried loofahs to sweep natural organic paints (charcoal-black, vermillion) to press your print.'
            },
            icon: 'craft'
          }
        ]
      }
    ]
  },
  {
    id: 'center-terracotta',
    title: { vi: 'Hành Trình Đất Nung Sông Thu Bồn: Gốm Thanh Hà & Phước Kiều', en: 'Thu Bon Terracotta Road: Thanh Ha Earthenware & Bronze Gongs' },
    region: 'Center',
    duration: 1,
    style: 'explore',
    budget: 'luxury',
    days: [
      {
        dayNum: 1,
        focus: { vi: 'Gốm Nung Màu Lửa & Cổ Âm Đồng Phước Kiều', en: 'Fired Earth Earthenware & Acoustic Sound of Bronze Gongs' },
        steps: [
          {
            time: '08:30',
            activity: { vi: 'Đi thuyền gỗ mộc ngược dòng Thu Bồn', en: 'Private wooden boat tour upstream on Thu Bon River' },
            location: { vi: 'Hội An → Làng gốm Thanh Hà', en: 'Hoi An → Thanh Ha Village' },
            desc: {
              vi: 'Tận hưởng làn gió mát lành trên thuyền gỗ truyền thống, ngắm nhìn phong cảnh sông nước miền Trung hữu tình thanh tịnh.',
              en: 'Savor gentle river breezes on a classic wooden skiff, viewing traditional fishing nets and central countryside.'
            },
            icon: 'transport'
          },
          {
            time: '09:30',
            activity: { vi: 'Chuốt gốm bằng chân cổ truyền & trạm khắc đất nung', en: 'Foot-pedal clay throwing & terracotta bas-relief masterclass' },
            location: { vi: 'Xưởng Gốm Mộc Ven Sông', en: 'Riverfront Terracotta Studio' },
            desc: {
              vi: 'Hợp tác nhịp nhàng cùng 2 nghệ nhân lão luyện: một người chuốt đất, một người dùng chân xoay bàn xoay gỗ cổ, tạo nên những chiếc bình mộc mạc ấm áp.',
              en: 'Collaborate with veteran potters in a rhythmic duet: one master operates the foot-pedal wheel, while you form warm brick-red clay.'
            },
            icon: 'craft'
          },
          {
            time: '12:00',
            activity: { vi: 'Ăn trưa Mì Quảng niêu đất & Bánh đập xúc hến', en: 'Claypot Mi Quang Noodles & Grilled rice paper with river clams' },
            location: { vi: 'Vườn gốm Thanh Hà', en: 'Terracotta Garden Restaurant' },
            desc: {
              vi: 'Thưởng thức mì Quảng ếch nấu niêu đất nung thơm lừng cùng bánh tráng đập xúc hến xào sả ớt giòn rụm khó quên.',
              en: 'Enjoy spiced frog Mi Quang noodles cooked in custom terracotta pots, served with crispy sesame rice crackers and river clams.'
            },
            icon: 'food'
          },
          {
            time: '14:00',
            activity: { vi: 'Thẩm âm Cồng Chiêng cổ & Đúc đồng mỹ nghệ', en: 'Sacred gong acoustic tuning & bronze fine-arts audit' },
            location: { vi: 'Làng Đúc Đồng Phước Kiều', en: 'Phuoc Kieu Bronze space' },
            desc: {
              vi: 'Tham quan lò nấu đồng rực lửa, trải nghiệm kỹ thuật thẩm âm độc nhất vô nhị giúp hiệu chỉnh tần số âm vang cồng chiêng vang vọng núi rừng Tây Nguyên.',
              en: 'Witness fiery bronze melting furnaces, trying your ear at gong acoustic tuning to adjust sacred resonance parameters.'
            },
            icon: 'craft'
          }
        ]
      }
    ]
  }
];

export default function AIItineraryPage() {
  const locale = useLocale() as 'vi' | 'en';
  const [phase, setPhase] = useState<'form' | 'loading' | 'result'>('form');
  const [selectedRegion, setSelectedRegion] = useState<'North' | 'Center'>('North');
  const [selectedDuration, setSelectedDuration] = useState<number>(2);
  const [selectedStyle, setSelectedStyle] = useState<string>('workshop');
  const [selectedBudget, setSelectedBudget] = useState<string>('luxury');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [generatedItinerary, setGeneratedItinerary] = useState<SimulatedItinerary | null>(null);

  const loadingSequence = [
    { vi: 'Đang phân tích định vị địa lý các làng di sản văn hóa...', en: 'Analyzing geographical hot spots of heritage craft villages...' },
    { vi: 'Đang quét dữ liệu lịch trống của các nghệ nhân ưu tú...', en: 'Checking active booking calendars of grandmaster artisans...' },
    { vi: 'Đang lựa chọn món ăn ẩm thực đất nung đặc sản địa phương...', en: 'Selecting classic countryside claypot food specialties...' },
    { vi: 'Đang cấu trúc tuyến đường di chuyển tối ưu nhất...', en: 'Optimizing transport transit pathways for seamless tour rhythm...' },
    { vi: 'Đang hoàn thiện biên niên sử di sản Kinh Bắc & Thu Bồn...', en: 'Finalizing cultural storytelling segments for Kinh Bac & Thu Bon...' },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase('loading');
    setLoadingStep(0);

    // Simulate animated loading progress
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSequence.length - 1) {
          clearInterval(interval);
          
          // Match the best itinerary based on criteria
          const matched = ITINERARIES.find(
            it => it.region === selectedRegion && it.duration <= selectedDuration
          ) || ITINERARIES[0];
          
          setGeneratedItinerary(matched);
          setPhase('result');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const t = {
    title: locale === 'vi' ? 'Công Cụ Thiết Kế Lịch Trình Di Sản / AI Itinerary' : 'AI Itinerary Planner & Smart Tour Assistant',
    desc: locale === 'vi' 
      ? 'Hệ thống định vị thực địa kết hợp Trí Tuệ Nhân Tạo giúp thiết kế chuyến khảo sát làng nghề, đặt chỗ nghệ nhân và trải nghiệm ẩm thực di sản độc bản.' 
      : 'Interactive positioning system matching travel criteria with heritage villages, operational masterclass slots, and regional gastronomy guides.',
    regionLabel: locale === 'vi' ? 'Vùng di sản khảo sát' : 'Target Cultural Region',
    durationLabel: locale === 'vi' ? 'Thời gian hành trình' : 'Trip Duration',
    styleLabel: locale === 'vi' ? 'Phong cách trải nghiệm' : 'Heritage Experience Style',
    budgetLabel: locale === 'vi' ? 'Ngân sách phân bổ' : 'Budget Level',
    generateBtn: locale === 'vi' ? 'Thiết Kế Hành Trình Di Sản Bằng AI' : 'Design Custom Heritage Route',
    loadingTitle: locale === 'vi' ? 'Trí Tuệ Nhân Tạo Đang Tailoring Lịch Trình...' : 'AI Engine is Tailoring Your Heritage Route...',
    loadingSub: locale === 'vi' ? 'Đang tổng hợp tinh hoa văn hóa, lịch làm việc của các nghệ nhân ưu tú.' : 'Synthesizing historical records, transport routes, and artisan masterclass calendars.',
    resultTitle: locale === 'vi' ? 'Bản Đồ Hành Trình Di Sản Của Bạn' : 'Your Customized Heritage Route map',
    resultSub: locale === 'vi' ? 'Lịch trình độc bản thiết kế riêng dựa trên tùy chọn văn hóa của bạn.' : 'An editorial-grade custom tour engineered specifically for your cultural profile.',
    day: locale === 'vi' ? 'Ngày' : 'Day',
    foodSpot: locale === 'vi' ? 'Ẩm thực địa phương' : 'Local Gastronomy Recommend',
    transit: locale === 'vi' ? 'Di chuyển khuyến nghị' : 'Transport Guideline',
    startOver: locale === 'vi' ? 'Thiết kế hành trình mới' : 'Design New Route',
    exploreVillage: locale === 'vi' ? 'Tham quan website làng' : 'Visit Village Portal',
    metaHeading: locale === 'vi' ? 'Trải Nghiệm Hành Trình Thông Minh' : 'Autonomous Assistant System',
  };

  return (
    <div className="min-h-screen bg-parchment py-12 px-6 lg:px-8 relative select-none">
      {/* Organic Grain texture overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-10" />

      <div className="max-w-[1000px] mx-auto relative z-10 space-y-12 text-left">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <SectionLabel label={t.metaHeading} />
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold italic text-charcoal leading-none tracking-tight">
            {t.title}
          </h1>
          <p className="font-sans text-xs text-ash font-light leading-relaxed max-w-2xl">
            {t.desc}
          </p>
        </div>

        <OrnamentDivider className="text-stone/40" />

        <AnimatePresence mode="wait">
          {/* Phase 1: Input Form */}
          {phase === 'form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleGenerate}
              className="bg-cream border border-stone p-6 lg:p-10 rounded-sm shadow-sm space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Region */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    {t.regionLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRegion('North')}
                      className={`p-4 border rounded-sm text-left flex flex-col justify-between h-24 transition-all ${
                        selectedRegion === 'North'
                          ? 'border-lacquer bg-lacquer/5 text-ink'
                          : 'border-stone hover:border-bronze bg-transparent'
                      }`}
                    >
                      <span className="font-heading text-lg italic font-bold">Kinh Bắc / Thăng Long</span>
                      <span className="text-[9px] font-sans uppercase tracking-wider text-ash">Miền Bắc / North</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRegion('Center')}
                      className={`p-4 border rounded-sm text-left flex flex-col justify-between h-24 transition-all ${
                        selectedRegion === 'Center'
                          ? 'border-lacquer bg-lacquer/5 text-ink'
                          : 'border-stone hover:border-bronze bg-transparent'
                      }`}
                    >
                      <span className="font-heading text-lg italic font-bold">Thu Bồn / Quảng Nam</span>
                      <span className="text-[9px] font-sans uppercase tracking-wider text-ash">Miền Trung / Center</span>
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    {t.durationLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDuration(d)}
                        className={`p-3 border rounded-sm text-center flex flex-col items-center justify-center h-24 transition-all ${
                          selectedDuration === d
                            ? 'border-lacquer bg-lacquer/5 text-ink font-bold'
                            : 'border-stone hover:border-bronze bg-transparent'
                        }`}
                      >
                        <Calendar className={`w-5 h-5 mb-2 ${selectedDuration === d ? 'text-lacquer' : 'text-ash'}`} />
                        <span className="font-sans text-[11px] uppercase tracking-wider">
                          {d} {locale === 'vi' ? 'Ngày' : 'Days'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    {t.styleLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'workshop', label: locale === 'vi' ? 'Tự tay làm gốm & dệt lụa' : 'Hands-on Workshops' },
                      { id: 'explore', label: locale === 'vi' ? 'Nhiếp ảnh & Khám phá địa phương' : 'Heritage & Photo Tour' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyle(st.id)}
                        className={`p-3.5 border rounded-sm text-left flex flex-col justify-between h-20 transition-all ${
                          selectedStyle === st.id
                            ? 'border-lacquer bg-lacquer/5 text-ink font-bold'
                            : 'border-stone hover:border-bronze bg-transparent'
                        }`}
                      >
                        <span className="font-sans text-[11px] leading-tight">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    {t.budgetLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'budget', label: locale === 'vi' ? 'Tiết kiệm / Trải nghiệm mộc' : 'Local & Authentic' },
                      { id: 'luxury', label: locale === 'vi' ? 'Bảo tàng & Xe Limousine đưa đón' : 'Private Luxury Carriage' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBudget(b.id)}
                        className={`p-3.5 border rounded-sm text-left flex flex-col justify-between h-20 transition-all ${
                          selectedBudget === b.id
                            ? 'border-lacquer bg-lacquer/5 text-ink font-bold'
                            : 'border-stone hover:border-bronze bg-transparent'
                        }`}
                      >
                        <span className="font-sans text-[11px] leading-tight">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone/30 flex justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[12px] px-10 py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  <span>{t.generateBtn}</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* Phase 2: Beautiful AI loading state */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-charcoal text-cream border border-gold/20 p-8 lg:p-16 rounded-sm text-center shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
            >
              {/* Spinning backdrop mandala */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,149,42,0.06)_0%,transparent_70%)] pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold flex items-center justify-center animate-spin mb-8">
                <Compass className="w-8 h-8 text-gold" />
              </div>

              <div className="space-y-4 max-w-lg">
                <h3 className="font-heading text-2xl lg:text-3xl italic text-cream">
                  {t.loadingTitle}
                </h3>
                <p className="font-sans text-[11px] text-stone/80 leading-relaxed font-light">
                  {t.loadingSub}
                </p>
              </div>

              {/* Progress items */}
              <div className="w-full max-w-sm mt-10 space-y-2.5 text-left border-t border-stone/20 pt-6">
                {loadingSequence.map((step, idx) => {
                  const isActive = idx === loadingStep;
                  const isDone = idx < loadingStep;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs font-sans transition-all duration-300 ${
                        isActive ? 'text-gold font-semibold translate-x-1' : isDone ? 'text-stone/40' : 'text-stone/70 opacity-30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-gold animate-ping' : isDone ? 'bg-stone/30' : 'bg-stone/10'
                      }`} />
                      <span>{step[locale]}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Phase 3: Results Display */}
          {phase === 'result' && generatedItinerary && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Output Header Panel */}
              <div className="bg-cream border border-stone p-6 rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
                <div className="space-y-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-gold block">
                    ✦ {t.resultTitle}
                  </span>
                  <h2 className="font-heading text-2xl lg:text-3xl font-bold italic text-charcoal leading-tight">
                    {generatedItinerary.title[locale]}
                  </h2>
                  <p className="font-sans text-xs text-ash font-light">
                    {t.resultSub}
                  </p>
                </div>

                <button
                  onClick={() => setPhase('form')}
                  className="inline-flex items-center justify-center gap-2 border border-stone hover:border-bronze text-charcoal font-sans font-semibold uppercase tracking-wider text-[11px] px-5 py-3 rounded-xs shrink-0 bg-transparent transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.startOver}</span>
                </button>
              </div>

              {/* Day-by-Day Timeline Render */}
              <div className="space-y-12 relative pl-8 md:pl-16 before:absolute before:left-3.5 md:before:left-7.5 before:top-4 before:bottom-4 before:w-px before:bg-stone">
                
                {generatedItinerary.days.map(day => (
                  <div key={day.dayNum} className="space-y-6 relative">
                    
                    {/* Floating Day Indicator */}
                    <div className="absolute -left-8 md:-left-16 top-1 flex items-center justify-center z-10">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-stone bg-cream text-charcoal flex items-center justify-center font-heading text-sm md:text-md italic font-bold shadow-xs">
                        {day.dayNum}
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                        {t.day} {day.dayNum}
                      </span>
                      <h3 className="font-heading text-2xl font-bold italic text-charcoal leading-snug">
                        {day.focus[locale]}
                      </h3>
                    </div>

                    {/* Steps list */}
                    <div className="grid grid-cols-1 gap-5">
                      {day.steps.map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          className="bg-cream border border-stone p-5 rounded-sm hover:shadow-hover transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                        >
                          {/* Hour & Location */}
                          <div className="md:col-span-3 space-y-1">
                            <span className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-lacquer tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              {step.time}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-ash font-sans block">
                              {step.location[locale]}
                            </span>
                          </div>

                          {/* Activity content */}
                          <div className="md:col-span-9 space-y-2">
                            <h4 className="font-heading text-lg font-bold text-charcoal italic leading-tight">
                              {step.activity[locale]}
                            </h4>
                            <p className="font-sans text-xs text-ash font-light leading-relaxed">
                              {step.desc[locale]}
                            </p>

                            {/* Contextual icons or badges based on types */}
                            <div className="flex gap-2 pt-1.5">
                              {step.icon === 'craft' && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded-xs">
                                  <Award className="w-3 h-3" />
                                  {locale === 'vi' ? 'Trải nghiệm mộc' : 'Artisan Workshop'}
                                </span>
                              )}
                              {step.icon === 'food' && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 border border-amber-200 rounded-xs">
                                  <Coffee className="w-3 h-3" />
                                  {locale === 'vi' ? 'Thưởng ẩm' : 'Gastronomy'}
                                </span>
                              )}
                              {step.icon === 'transport' && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-blue-800 bg-blue-50 px-2.5 py-1 border border-blue-200 rounded-xs">
                                  <Car className="w-3 h-3" />
                                  {locale === 'vi' ? 'Xe trung chuyển' : 'Carriage'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual CTA banner to direct flow into dynamic site */}
              <div className="bg-charcoal text-cream border border-gold/20 p-6 rounded-sm text-center relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                  <Compass className="w-48 h-48 text-gold" />
                </div>
                <h3 className="font-heading text-xl italic text-gold">
                  {locale === 'vi' ? 'Sẵn Sàng Cho Chuyến Khảo Sát Thực Địa Của Bạn?' : 'Ready to Launch Your Cultural Fieldwork?'}
                </h3>
                <p className="font-sans text-xs text-stone/80 max-w-lg mx-auto font-light leading-relaxed">
                  {locale === 'vi'
                    ? 'Bạn có thể trực tiếp tham quan các trang chủ làng nghệ thuật thành viên để đặt lịch hẹn cùng nghệ nhân lão luyện.'
                    : 'Enter the custom village spaces to book direct slots and buy traditional fine arts directly from artisans.'}
                </p>
                <div className="pt-2 flex justify-center gap-4">
                  <Link
                    href="/villages"
                    className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[11px] px-6 py-3 rounded-sm hover:brightness-110 shadow-sm transition-all"
                  >
                    <span>{locale === 'vi' ? 'Danh Sách Làng Nghề' : 'Explore Heritage Villages'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
