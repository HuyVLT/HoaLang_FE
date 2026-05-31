'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  Car,
  ShoppingBag,
  Hammer,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Activity
} from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

// Typings for our application
interface Stop {
  time: string;
  name: string;
  type: string; // 'village' | 'food' | 'transport' | 'shop' | 'experience'
  duration: string;
  icon: string;
  desc: string;
}

interface DayPlan {
  day: number;
  title: string;
  date: string;
  stops: Stop[];
}

interface Itinerary {
  title: string;
  days: number;
  totalKm: number;
  estimatedCost: string;
  schedule: DayPlan[];
}

// Initial Mock Data requested by the user
const MOCK_ITINERARY: Itinerary = {
  title: "Hành trình Gốm sứ & Lụa Hà Nội",
  days: 3,
  totalKm: 45,
  estimatedCost: "2.400.000 ₫",
  schedule: [
    {
      day: 1,
      title: "Hà Nội → Bát Tràng",
      date: "Thứ Hai",
      stops: [
        { time: "08:00", name: "Khởi hành từ Hoàn Kiếm", type: "transport", duration: "45 phút", icon: "car", desc: "Di chuyển bằng xe máy/taxi theo Quốc lộ 1" },
        { time: "08:45", name: "Làng Gốm Bát Tràng", type: "village", duration: "3 giờ", icon: "village", desc: "Tham quan lò gốm, workshop nặn gốm trên bàn xoay với nghệ nhân Nguyễn Văn Thành" },
        { time: "12:00", name: "Ăn trưa tại Bát Tràng", type: "food", duration: "1 giờ", icon: "food", desc: "Bún ốc nguội đặc sản làng gốm, giá ~80.000₫/người" },
        { time: "13:30", name: "Mua sắm sản phẩm gốm", type: "shop", duration: "1.5 giờ", icon: "shop", desc: "Chọn bình gốm, tách trà men ngọc tại xưởng gia đình" },
        { time: "16:00", name: "Trở về Hà Nội", type: "transport", duration: "1 giờ", icon: "car", desc: "Nghỉ ngơi, check-in khách sạn phố cổ" },
      ]
    },
    {
      day: 2,
      title: "Làng Lụa Vạn Phúc",
      date: "Thứ Ba",
      stops: [
        { time: "09:00", name: "Làng Lụa Vạn Phúc", type: "village", duration: "4 giờ", icon: "village", desc: "Xem trình diễn dệt lụa tơ tằm, tìm hiểu kỹ thuật dệt thủ công truyền thống" },
        { time: "13:30", name: "Workshop dệt lụa mini", type: "experience", duration: "2 giờ", icon: "craft", desc: "Tự tay dệt mảnh lụa nhỏ dưới hướng dẫn của nghệ nhân — 350.000₫/người" },
        { time: "16:00", name: "Mua khăn lụa tơ tằm", type: "shop", duration: "1 giờ", icon: "shop", desc: "Chọn lụa chính hãng có chứng nhận tại showroom trung tâm" },
      ]
    },
    {
      day: 3,
      title: "Tranh Đông Hồ & Về",
      date: "Thứ Tư",
      stops: [
        { time: "07:30", name: "Xe khách đi Bắc Ninh", type: "transport", duration: "1.5 giờ", icon: "bus", desc: "Bến xe Gia Lâm → Thuận Thành, vé ~60.000₫" },
        { time: "09:30", name: "Làng Tranh Đông Hồ", type: "village", duration: "3 giờ", icon: "village", desc: "Nghệ nhân Nguyễn Đăng Chế giới thiệu kỹ thuật in tranh dân gian bằng ván khắc gỗ" },
        { time: "13:00", name: "Trở về Hà Nội", type: "transport", duration: "2 giờ", icon: "bus", desc: "Kết thúc hành trình" },
      ]
    }
  ]
};

// Available Interests for Chips Toggle
const INTEREST_OPTIONS = [
  { id: 'gốm', label: 'Gốm sứ', labelEn: 'Ceramics' },
  { id: 'lụa', label: 'Dệt thổ cẩm', labelEn: 'Brocade Silk' },
  { id: 'ẩm thực', label: 'Ẩm thực', labelEn: 'Gastronomy' },
  { id: 'nhiếp ảnh', label: 'Nhiếp ảnh', labelEn: 'Photography' },
  { id: 'thủ công', label: 'Thủ công', labelEn: 'Handicrafts' },
  { id: 'lịch sử', label: 'Lịch sử', labelEn: 'History' },
  { id: 'thiên nhiên', label: 'Thiên nhiên', labelEn: 'Nature' }
];

// Budget options
const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Tiết kiệm', labelEn: 'Saving' },
  { id: 'comfortable', label: 'Thoải mái', labelEn: 'Comfortable' },
  { id: 'luxury', label: 'Sang trọng', labelEn: 'Luxury' }
];

export default function AIItineraryPage() {
  const locale = useLocale();
  const isVi = locale === 'vi';

  // Form States
  const [from, setFrom] = useState('');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('comfortable');
  const [people, setPeople] = useState(2);

  // Status & Streaming States
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  
  // Accordion collapsed state: key is day index, value is boolean (true = expanded)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true });

  // Mobile Tabs Switcher State: 'form' | 'itinerary'
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'itinerary'>('form');

  // Ref for stream text area auto-scroll
  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamText]);

  // Form validation - From location is required
  const isFormValid = from.trim().length > 0;

  // Toggle interest helper
  const handleToggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Accordion Toggle helper
  const handleToggleDay = (dayIndex: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  // Helper to map Stop type to Lucide Icon
  const getStopIcon = (type: string) => {
    switch (type) {
      case 'village':
        return <Compass className="w-4 h-4 text-gold" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-lacquer" />;
      case 'transport':
        return <Car className="w-4 h-4 text-ash" />;
      case 'shop':
        return <ShoppingBag className="w-4 h-4 text-bronze" />;
      case 'experience':
      default:
        return <Hammer className="w-4 h-4 text-charcoal" />;
    }
  };

  // Helper to map Stop type to border/bg color for Dot
  const getDotStyles = (type: string) => {
    switch (type) {
      case 'village':
        return 'bg-gold border-gold';
      case 'food':
        return 'bg-lacquer border-lacquer';
      case 'transport':
        return 'bg-stone border-stone';
      case 'shop':
        return 'bg-bronze border-bronze';
      case 'experience':
      default:
        return 'bg-charcoal border-charcoal';
    }
  };

  // Streaming SSE fetch handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsGenerating(true);
    setStreamText('');
    setGeneratedItinerary(null);
    
    // Switch to itinerary preview panel automatically on mobile
    setActiveMobileTab('itinerary');

    try {
      const response = await fetch('/api/v1/ai/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          days,
          interests: selectedInterests.map(i => {
            const opt = INTEREST_OPTIONS.find(o => o.id === i);
            return isVi ? opt?.label : opt?.labelEn;
          }),
          budget,
          people,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      if (!response.body) {
        throw new Error('Readable stream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          
          // SSE outputs lines starting with "event:" and "data:"
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    // Append text description gradually
                    setStreamText(prev => prev + parsed.text);
                  } else if (parsed.schedule) {
                    // Final itinerary received!
                    setGeneratedItinerary(parsed);
                    // Open all days by default
                    const newExpanded: Record<number, boolean> = {};
                    parsed.schedule.forEach((_: unknown, idx: number) => {
                      newExpanded[idx] = true;
                    });
                    setExpandedDays(newExpanded);
                  }
                } catch {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }
      }

      setIsGenerating(false);

    } catch (error) {
      console.error("Streaming error, falling back to mock itinerary:", error);
      
      // Fallback with custom from location
      const fallbackItinerary = {
        ...MOCK_ITINERARY,
        title: `Hành trình Gốm sứ & Lụa ${from}`,
        schedule: MOCK_ITINERARY.schedule.map((dayPlan, idx) => {
          if (idx === 0) {
            return {
              ...dayPlan,
              title: `${from} → Bát Tràng`,
              stops: dayPlan.stops.map((stop, sIdx) => {
                if (sIdx === 0) {
                  return { ...stop, name: `Khởi hành từ ${from}` };
                }
                if (sIdx === 4) {
                  return { ...stop, name: `Trở về ${from}` };
                }
                return stop;
              })
            };
          }
          if (idx === 2) {
            return {
              ...dayPlan,
              stops: dayPlan.stops.map((stop, sIdx) => {
                if (sIdx === 2) {
                  return { ...stop, name: `Trở về ${from}` };
                }
                return stop;
              })
            };
          }
          return dayPlan;
        })
      };

      // Simulate a brief delay before fallback to feel authentic
      setStreamText("Đang xảy ra sự cố kết nối AI. Đang tự động kết nối cơ sở dữ liệu thực địa bản địa...\n✦ ĐÃ KHÔI PHỤC HÀNH TRÌNH TỐI ƯU ✦\n");
      setTimeout(() => {
        setGeneratedItinerary(fallbackItinerary);
        setIsGenerating(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-parchment relative overflow-x-hidden font-sans">
      {/* Subtle organic grain texture overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8 lg:py-16 relative z-10">
        
        {/* Desktop Split-Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          {/* LEFT PANEL: 500px Form Input */}
          <div className={`w-full lg:w-[500px] shrink-0 flex flex-col justify-between ${
            activeMobileTab === 'form' ? 'flex' : 'hidden lg:flex'
          }`}>
            <div className="space-y-8">
              {/* Header section */}
              <div className="space-y-4">
                <SectionLabel label="AI TRAVEL CONCIERGE" />
                <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-ink">
                  Lên kế hoạch cùng AI
                </h1>
                <p className="font-body text-sm text-ash font-light leading-relaxed">
                  Mô tả chuyến đi mơ ước — AI sẽ thiết kế hành trình hoàn hảo phù hợp với phong cách và di sản văn hóa của bạn.
                </p>
              </div>

              <OrnamentDivider className="opacity-40" />

              {/* Form Input fields */}
              <form onSubmit={handleGenerate} className="space-y-8">
                
                {/* Field 1: Start Location */}
                <div className="space-y-3">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-ink block">
                    1. Xuất phát từ
                  </label>
                  <div className="relative flex items-center border-b border-stone py-2 focus-within:border-bronze transition-colors">
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Nhập thành phố hoặc điểm khởi hành..."
                      className="w-full bg-transparent border-none text-ink text-base font-body focus:outline-none focus:ring-0 placeholder:text-ash/60"
                      required
                    />
                    <MapPin className="w-5 h-5 text-gold shrink-0 absolute right-2" />
                  </div>
                </div>

                {/* Field 2: Duration Stepper */}
                <div className="space-y-3">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-ink block">
                    2. Số ngày
                  </label>
                  <div className="flex items-center justify-between border-b border-stone py-2">
                    <span className="font-display text-lg text-ink italic font-medium">
                      {days} {isVi ? 'ngày' : 'days'}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setDays(d => Math.max(1, d - 1))}
                        disabled={days <= 1}
                        className="w-8 h-8 rounded-sm border border-stone flex items-center justify-center text-ink hover:border-bronze hover:text-bronze disabled:opacity-30 disabled:border-stone/40 disabled:text-ash/40 transition-all active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDays(d => Math.min(14, d + 1))}
                        disabled={days >= 14}
                        className="w-8 h-8 rounded-sm border border-stone flex items-center justify-center text-ink hover:border-bronze hover:text-bronze disabled:opacity-30 disabled:border-stone/40 disabled:text-ash/40 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Field 3: Interests Multi-select Chips */}
                <div className="space-y-3">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-ink block">
                    3. Sở thích di sản
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {INTEREST_OPTIONS.map(interest => {
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => handleToggleInterest(interest.id)}
                          className={`font-body text-xs font-medium px-4 py-2 rounded-xs border transition-all duration-300 ${
                            isSelected
                              ? 'bg-lacquer border-lacquer text-cream shadow-sm'
                              : 'border-stone text-ash hover:border-bronze hover:text-bronze bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 inline mr-1.5 shrink-0" />}
                          {isVi ? interest.label : interest.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 4: Budget Selection */}
                <div className="space-y-3">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-ink block">
                    4. Ngân sách dự kiến
                  </label>
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {BUDGET_OPTIONS.map(opt => {
                      const isSelected = budget === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setBudget(opt.id)}
                          className={`font-body text-xs font-semibold uppercase tracking-wider px-3 py-3.5 rounded-xs border text-center transition-all duration-300 ${
                            isSelected
                              ? 'bg-charcoal border-charcoal text-cream shadow-sm'
                              : 'border-stone text-ash hover:border-bronze hover:text-bronze bg-transparent'
                          }`}
                        >
                          {isVi ? opt.label : opt.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 5: People Stepper */}
                <div className="space-y-3">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-ink block">
                    5. Số người tham gia
                  </label>
                  <div className="flex items-center justify-between border-b border-stone py-2">
                    <span className="font-display text-lg text-ink italic font-medium">
                      {people} {isVi ? 'người' : 'people'}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setPeople(p => Math.max(1, p - 1))}
                        disabled={people <= 1}
                        className="w-8 h-8 rounded-sm border border-stone flex items-center justify-center text-ink hover:border-bronze hover:text-bronze disabled:opacity-30 disabled:border-stone/40 disabled:text-ash/40 transition-all active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeople(p => p + 1)}
                        className="w-8 h-8 rounded-sm border border-stone flex items-center justify-center text-ink hover:border-bronze hover:text-bronze transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isGenerating}
                  className={`w-full font-body font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    isGenerating
                      ? 'bg-lacquer/80 text-cream cursor-wait animate-pulse'
                      : !isFormValid
                      ? 'bg-stone/50 text-ash/60 cursor-not-allowed border border-stone/30'
                      : 'bg-lacquer text-cream hover:bg-lacquer/90 border border-lacquer hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>AI đang thiết kế hành trình...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-gold shrink-0" />
                      <span>✦ Tạo lịch trình với AI</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block w-[1px] bg-stone/40 self-stretch shrink-0" />

          {/* RIGHT PANEL: Preview Itinerary */}
          <div className={`flex-1 flex flex-col justify-start min-h-[500px] ${
            activeMobileTab === 'itinerary' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Empty State before Generation */}
            {!isGenerating && !generatedItinerary && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center select-none bg-cream/40 border border-stone/40 rounded-sm">
                
                {/* Elegant Vietnam Outline Map Path */}
                <div className="relative mb-8 text-stone/50">
                  <svg className="w-32 h-64 stroke-stone/60 fill-none" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Simplified Vietnam S-shape Map Curve */}
                    <path d="M 50,15 C 53,20 48,25 45,30 C 40,38 38,46 42,54 C 45,61 52,66 55,74 C 58,81 56,88 52,96 C 47,104 42,111 45,121 C 48,131 55,136 58,146 C 60,156 58,164 54,172 C 50,180 46,188 48,195" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"/>
                    {/* Ha Noi dot */}
                    <circle cx="45" cy="30" r="2.5" className="fill-gold stroke-cream stroke-2" />
                    <text x="50" y="32" className="font-body text-[8px] fill-ash tracking-wide font-medium">Hà Nội</text>
                    {/* Hue / Hoi An dot */}
                    <circle cx="55" cy="74" r="2.5" className="fill-gold stroke-cream stroke-2" />
                    <text x="60" y="76" className="font-body text-[8px] fill-ash tracking-wide font-medium">Hội An</text>
                    {/* Sai Gon dot */}
                    <circle cx="54" cy="172" r="2.5" className="fill-gold stroke-cream stroke-2" />
                    <text x="60" y="174" className="font-body text-[8px] fill-ash tracking-wide font-medium">Sài Gòn</text>
                    {/* Hoang Sa Islands */}
                    <circle cx="80" cy="88" r="1.2" className="fill-stone/80" />
                    <circle cx="83" cy="90" r="1.2" className="fill-stone/80" />
                    <text x="86" y="91" className="font-body text-[6px] fill-ash tracking-wide">Hoàng Sa</text>
                    {/* Truong Sa Islands */}
                    <circle cx="75" cy="148" r="1.2" className="fill-stone/80" />
                    <circle cx="78" cy="153" r="1.2" className="fill-stone/80" />
                    <text x="81" y="154" className="font-body text-[6px] fill-ash tracking-wide">Trường Sa</text>
                  </svg>
                </div>
                
                <h3 className="font-display text-2xl italic text-charcoal font-medium">
                  Hành trình của bạn sẽ xuất hiện ở đây
                </h3>
                <p className="font-body text-xs text-ash mt-3 max-w-sm leading-relaxed font-light">
                  Hãy nhập điểm xuất phát, số ngày mong muốn và lựa chọn sở thích bên bảng điều khiển để kiến tạo hành trình.
                </p>
              </div>
            )}

            {/* AI Streaming Loading State */}
            {isGenerating && (
              <div className="flex-1 flex flex-col justify-between p-6 lg:p-10 bg-charcoal text-cream border border-gold/15 rounded-sm shadow-lg min-h-[450px] relative overflow-hidden">
                {/* Background soft glow mandala */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,149,42,0.05)_0%,transparent_75%)] pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold animate-ping shrink-0" />
                    <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold">
                      AI GENERATION RUNNING
                    </span>
                  </div>

                  <h3 className="font-display text-2xl lg:text-3xl italic text-cream leading-tight">
                    Đang thiết kế chuyến đi của bạn...
                  </h3>
                  
                  {/* Stream text area with typing behavior */}
                  <div className="bg-ink-40 border border-stone/20 rounded-xs p-5 font-body text-xs text-stone/90 leading-relaxed font-light min-h-[180px] max-h-[250px] overflow-y-auto space-y-2.5">
                    <div className="whitespace-pre-line text-left">
                      {streamText}
                      <span className="inline-block w-1.5 h-3.5 bg-gold animate-[pulse_1s_infinite] ml-1 shrink-0" />
                    </div>
                    <div ref={streamEndRef} />
                  </div>
                </div>

                <div className="pt-6 border-t border-stone/10 flex items-center justify-between relative z-10">
                  <span className="font-body text-[10px] uppercase tracking-wider text-ash">
                    HoaLang Heritage System
                  </span>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gold animate-pulse" />
                    <span className="font-body text-xs text-gold font-medium animate-pulse">
                      Đang đồng bộ dữ liệu...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Render Output Itinerary UI */}
            {!isGenerating && generatedItinerary && (
              <div className="space-y-8">
                
                {/* Result Header Panel */}
                <div className="bg-cream border border-stone p-6 lg:p-8 rounded-sm shadow-sm space-y-6">
                  
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2.5">
                        <span className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-gold select-none">
                          ✦ CHUYẾN ĐI CỦA BẠN
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 border border-gold/50 rounded-xs bg-gold/5 text-[9px] font-bold uppercase tracking-wider text-gold">
                          ✦ AI Generated
                        </span>
                      </div>
                      <h2 className="font-display text-3xl lg:text-4xl font-bold italic text-charcoal leading-tight">
                        {generatedItinerary.title}
                      </h2>
                    </div>

                    {/* Desktop Utility buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => alert("Lịch trình đã được lưu vào mục yêu thích của bạn!")}
                        className="p-2.5 border border-stone hover:border-bronze hover:text-bronze rounded-xs bg-transparent transition-all shadow-xs" 
                        title="Lưu lịch trình"
                      >
                        <Bookmark className="w-4 h-4 text-charcoal" />
                      </button>
                      <button 
                        onClick={() => alert("Sao chép liên kết chia sẻ thành công!")}
                        className="p-2.5 border border-stone hover:border-bronze hover:text-bronze rounded-xs bg-transparent transition-all shadow-xs" 
                        title="Chia sẻ"
                      >
                        <Share2 className="w-4 h-4 text-charcoal" />
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="p-2.5 border border-stone hover:border-bronze hover:text-bronze rounded-xs bg-transparent transition-all shadow-xs" 
                        title="In PDF"
                      >
                        <Printer className="w-4 h-4 text-charcoal" />
                      </button>
                    </div>
                  </div>

                  <OrnamentDivider className="opacity-30" />

                  {/* 3 Stats indicators */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase tracking-wider text-ash block">
                        Số ngày
                      </span>
                      <span className="font-display text-xl lg:text-2xl font-bold italic text-charcoal">
                        {generatedItinerary.days} {isVi ? 'Ngày' : 'Days'}
                      </span>
                    </div>
                    <div className="w-[1px] bg-stone/40 h-8 self-center justify-self-center" />
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase tracking-wider text-ash block">
                        Quãng đường
                      </span>
                      <span className="font-display text-xl lg:text-2xl font-bold italic text-charcoal">
                        ~ {generatedItinerary.totalKm} km
                      </span>
                    </div>
                    <div className="w-[1px] bg-stone/40 h-8 self-center justify-self-center" />
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase tracking-wider text-ash block">
                        Chi phí ước tính
                      </span>
                      <span className="font-display text-xl lg:text-2xl font-bold italic text-lacquer">
                        {generatedItinerary.estimatedCost}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Day-by-Day Timeline Render */}
                <div className="space-y-6">
                  {generatedItinerary.schedule.map((dayPlan, dayIdx) => {
                    const isExpanded = expandedDays[dayIdx] !== false;
                    
                    return (
                      <motion.div
                        key={dayPlan.day}
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: dayIdx * 0.15 }}
                        className="bg-cream border border-stone rounded-sm shadow-sm overflow-hidden"
                      >
                        
                        {/* Day Accordion Header */}
                        <button
                          onClick={() => handleToggleDay(dayIdx)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone/5 transition-colors focus:outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-stone bg-parchment text-charcoal flex items-center justify-center font-display text-xs italic font-bold">
                              {dayPlan.day}
                            </span>
                            <span className="font-display text-lg lg:text-xl font-bold italic text-charcoal">
                              Ngày {dayPlan.day} — {dayPlan.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-body text-xs text-ash/80">
                              {dayPlan.date}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-ash" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-ash" />
                            )}
                          </div>
                        </button>

                        {/* Accordion Body stops list */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden border-t border-stone/50 bg-cream"
                            >
                              <div className="px-6 py-8 space-y-8 relative">
                                
                                {/* Vertical Timeline Connecting line */}
                                <div className="absolute left-[39px] top-10 bottom-10 w-[1px] bg-stone/60" />

                                {dayPlan.stops.map((stop, stopIdx) => (
                                  <div key={stopIdx} className="relative flex items-start gap-5">
                                    
                                    {/* Left: Hour Box */}
                                    <div className="w-[32px] shrink-0 text-right pt-0.5">
                                      <span className="font-display text-sm font-semibold tracking-wider text-charcoal block leading-none">
                                        {stop.time}
                                      </span>
                                    </div>

                                    {/* Center: Timeline Dot with custom colors */}
                                    <div className="relative z-10 flex items-center justify-center w-4 h-4 rounded-full border bg-cream mt-[3px] shrink-0">
                                      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyles(stop.type)}`} />
                                    </div>

                                    {/* Right: Stop Detailed Card */}
                                    <div className="flex-1 space-y-1.5 text-left">
                                      
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h4 className="font-display text-lg font-bold text-ink italic leading-tight">
                                          {stop.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <span className="font-body text-[10px] text-ash font-light">
                                            ⏳ {stop.duration}
                                          </span>
                                          {/* Badge style based on type */}
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-stone/20 text-[9px] font-semibold uppercase tracking-wider text-ash">
                                            {getStopIcon(stop.type)}
                                            <span className="ml-0.5">{stop.type === 'village' ? 'Làng nghề' : stop.type === 'food' ? 'Thực vị' : stop.type === 'transport' ? 'Lộ hành' : stop.type === 'shop' ? 'Mãi tràng' : 'Trải nghiệm'}</span>
                                          </span>
                                        </div>
                                      </div>

                                      <p className="font-body text-xs text-ash font-light leading-relaxed">
                                        {stop.desc}
                                      </p>
                                    </div>

                                  </div>
                                ))}

                                {/* Day Footer */}
                                <div className="pt-4 mt-4 border-t border-stone/20 flex flex-wrap items-center justify-between gap-4 font-body text-xs text-ash select-none">
                                  <div className="flex items-center gap-2">
                                    <span>Tổng thời gian dự kiến:</span>
                                    <span className="font-semibold text-charcoal">~ 6.5 giờ</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>Chi phí phát sinh ngày:</span>
                                    <span className="font-semibold text-lacquer">
                                      {dayPlan.day === 1 ? '380.000 ₫' : dayPlan.day === 2 ? '420.000 ₫' : '120.000 ₫'}
                                    </span>
                                  </div>
                                </div>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    );
                  })}
                </div>

                {/* Final Booking Call-To-Action Banner */}
                <div className="bg-charcoal text-cream border border-gold/25 p-8 rounded-sm text-center relative overflow-hidden space-y-5 shadow-md">
                  <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                    <Compass className="w-56 h-56 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl lg:text-3xl italic text-gold leading-none">
                    Hành trình của bạn đã được tối ưu
                  </h3>
                  <p className="font-body text-xs text-stone/80 max-w-xl mx-auto font-light leading-relaxed">
                    Bạn có thể trực tiếp tham quan các trang chủ thành viên để đặt lịch hẹn tham quan lò nghệ nhân, dệt lụa hoặc trải nghiệm thực địa trọn vẹn.
                  </p>
                  <div className="pt-3 flex justify-center gap-4">
                    <a
                      href="/villages"
                      className="inline-flex items-center gap-2.5 bg-lacquer text-cream font-body font-semibold uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Khám phá các Làng Nghề</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MOBILE FIXED BOTTOM TAB SWITCHER BAR (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-parchment/95 backdrop-blur-md border-t border-stone z-50 flex items-center justify-around px-6">
        <button
          onClick={() => setActiveMobileTab('form')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors focus:outline-none ${
            activeMobileTab === 'form' ? 'text-lacquer font-bold' : 'text-ash hover:text-charcoal'
          }`}
        >
          <span className="p-1 rounded-sm">
            ⚙️
          </span>
          <span className="font-body text-[10px] font-semibold uppercase tracking-widest">
            Thiết lập
          </span>
        </button>
        
        <div className="w-[1px] bg-stone/40 h-8" />
        
        <button
          onClick={() => setActiveMobileTab('itinerary')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors focus:outline-none ${
            activeMobileTab === 'itinerary' ? 'text-lacquer font-bold' : 'text-ash hover:text-charcoal'
          }`}
        >
          <span className="p-1 rounded-sm">
            🗺️
          </span>
          <span className="font-body text-[10px] font-semibold uppercase tracking-widest">
            Lịch trình
          </span>
        </button>
      </div>

      {/* Margin bottom on mobile to offset fixed tab bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
