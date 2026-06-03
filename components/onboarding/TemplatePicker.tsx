'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, X } from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  sections: string[];
  mockImage: string;
  previewUrl: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'pottery-template',
    name: 'Gốm Sứ / Ceramics (Bát Tràng)',
    description: 'Tone đất sét nung đỏ trầm ấm dạt dào cảm xúc, tôn vinh nghệ thuật chạm khắc và nhào đất.',
    primaryColor: '#8B5A2B',
    accentColor: '#C4952A',
    fontHeading: 'Cormorant Garamond',
    sections: ['Hero', 'Story', 'Products', 'Experiences', 'Gallery', 'Testimonials', 'CTA', 'Map'],
    mockImage: '/images/village-bat-trang.png',
    previewUrl: '/images/village-bat-trang.png',
  },
  {
    id: 'silk-template',
    name: 'Dệt Lụa / Luxury Silk (Vạn Phúc)',
    description: 'Tone đỏ sơn mài & vàng hoàng gia quý phái, lộng lẫy tơ tằm óng ả đậm hơi thở cung đình.',
    primaryColor: '#8B1A1A',
    accentColor: '#C4952A',
    fontHeading: 'Playfair Display',
    sections: ['Hero', 'Story', 'Products', 'Gallery', 'Experiences', 'Testimonials', 'CTA', 'Map'],
    mockImage: '/images/village-van-phuc.png',
    previewUrl: '/images/village-van-phuc.png',
  },
  {
    id: 'minimal-template',
    name: 'Tranh Điệp / Minimal Dó (Đông Hồ)',
    description: 'Bản sắc mực nghiên lá tre tối giản thanh lịch, tạo cảm giác mộc mạc thư thái tự nhiên.',
    primaryColor: '#2E2318',
    accentColor: '#7A5C2E',
    fontHeading: 'Cormorant Garamond',
    sections: ['Hero', 'Story', 'Products', 'Gallery', 'CTA'],
    mockImage: '/images/village-dong-ho.png',
    previewUrl: '/images/village-dong-ho.png',
  },
];

function TemplateLivePreview({ templateId }: { templateId: string }) {
  // Define styling configurations for each template
  const configs: Record<string, {
    fontFamily: string;
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    cardBg: string;
    title: string;
    subtitle: string;
    heroImage: string;
    storyTitle: string;
    storyText: string;
    artisan: string;
    products: { name: string; price: string; image: string }[];
    hasExperiences: boolean;
    experiences: { title: string; desc: string; price: string }[];
  }> = {
    'pottery-template': {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      primaryColor: '#8B5A2B',
      accentColor: '#C4952A',
      bgColor: '#F5F0E8', // Parchment
      cardBg: '#FAF7F2', // Cream
      title: 'Hồn Đất Gia Lâm Gốm Sứ Bát Tràng',
      subtitle: 'Nơi lưu giữ nét đẹp tinh xảo hơn 700 năm của nghệ thuật nhào nặn đất sét và lửa men rạn trứ danh.',
      heroImage: '/images/village-bat-trang.png',
      storyTitle: 'Hành Trình Tinh Tế Của Đất & Lửa',
      storyText: 'Để làm nên một tác phẩm gốm Bát Tràng trứ danh, người nghệ nhân phải trải qua quy trình nghiêm ngặt từ chọn đất tràng sét, lắng lọc bùn mịn, xoay chuốt trên bàn xoay thủ công và nung lò đạt tới 1200 độ C.',
      artisan: 'Nghệ nhân ưu tú Nguyễn Văn Minh',
      products: [
        { name: 'Bình Hút Lộc Vẽ Vàng', price: '1.850.000 ₫', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80' },
        { name: 'Bộ Ấm Trà Men Rạn Cổ', price: '950.000 ₫', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80' }
      ],
      hasExperiences: true,
      experiences: [
        { title: 'Xoay Gốm Trên Bàn Xoay', desc: 'Đích thân nhào nặn đất sét dưới sự kèm cặp từ truyền nhân làng nghề Bát Tràng.', price: '250.000 ₫' }
      ]
    },
    'silk-template': {
      fontFamily: "'Playfair Display', Georgia, serif",
      primaryColor: '#8B1A1A',
      accentColor: '#C4952A',
      bgColor: '#FAF7F2', // Cream
      cardBg: '#F5F0E8', // Parchment
      title: 'Vương Triều Tơ Tằm Lụa Vạn Phúc',
      subtitle: 'Lộng lẫy tơ tằm óng ả đậm hơi thở cung đình, mang hồn cốt nghìn năm đất kinh kỳ.',
      heroImage: '/images/village-van-phuc.png',
      storyTitle: 'Kiến Tạo Kiệt Tác Tơ Tằm Hà Đông',
      storyText: 'Từng tấm lụa Hà Đông tơ tằm nguyên bản được dệt tay khéo léo trên các khung gỗ cổ truyền, trải qua công đoạn nhuộm tự nhiên và phơi nắng tạo nên độ óng mịn hoàn hảo.',
      artisan: 'Nghệ nhân nhân dân Triệu Văn Mão',
      products: [
        { name: 'Khăn Lụa Hà Đông Thêu Sen', price: '450.000 ₫', image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80' },
        { name: 'Áo Dài Gấm Vạn Phúc Hoa Điệp', price: '2.800.000 ₫', image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80' }
      ],
      hasExperiences: true,
      experiences: [
        { title: 'Nhuộm Lụa Tự Nhiên', desc: 'Học cách sử dụng lá cây rừng và củ nâu nhuộm màu truyền thống trên lụa tơ tằm.', price: '420.000 ₫' }
      ]
    },
    'minimal-template': {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      primaryColor: '#2E2318',
      accentColor: '#7A5C2E',
      bgColor: '#FAF7F2', // Cream
      cardBg: '#FAF7F2',
      title: 'Nghệ Thuật Tranh Đông Hồ - Điệp Giấy Dó',
      subtitle: 'Sự tinh giản mộc mạc lưu giữ hồn cội nguồn văn hóa Việt trên nền điệp óng ánh dệt từ vỏ sò.',
      heroImage: '/images/village-dong-ho.png',
      storyTitle: 'Khắc Họa Linh Hồn Việt Trên Điệp Dó',
      storyText: 'Mỗi bức tranh Đông Hồ tự hào chắt chiu từ năm màu tự nhiên mộc mạc: màu đen óng than lá tre, đỏ sỏi đồi nung gạch, vàng hạt dành dành, xanh lục chàm và trắng điệp sò.',
      artisan: 'Nghệ nhân ưu tú Nguyễn Hữu Quả',
      products: [
        { name: 'Tranh Đàn Lợn Âm Dương', price: '320.000 ₫', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80' },
        { name: 'Tranh Vinh Hoa Phú Quý', price: '320.000 ₫', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80' }
      ],
      hasExperiences: false,
      experiences: []
    }
  };

  const current = configs[templateId] || configs['pottery-template'];

  const vars = {
    '--primary-color': current.primaryColor,
    '--accent-color': current.accentColor,
    fontFamily: current.fontFamily,
  } as React.CSSProperties;

  return (
    <div style={vars} className="w-full text-ink text-left bg-parchment leading-relaxed font-sans overflow-hidden">
      {/* Dynamic Nav Header */}
      <div className="border-b border-stone/30 py-3 px-6 flex items-center justify-between bg-cream shrink-0 text-xs font-semibold uppercase tracking-wider">
        <span className="font-heading text-lg font-bold text-charcoal select-none italic" style={{ color: current.primaryColor }}>
          HoaLang
        </span>
        <div className="flex gap-4 text-[10px] text-ash">
          <span className="hover:text-ink">Sản phẩm</span>
          {current.hasExperiences && <span className="hover:text-ink">Trải nghiệm</span>}
          <span className="hover:text-ink">Câu chuyện</span>
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <div className="relative border-b border-stone/20 overflow-hidden flex flex-col justify-between py-12 px-6 min-h-[220px] bg-charcoal text-cream">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25" style={{ backgroundImage: `url(${current.heroImage})` }} />
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-gold" style={{ color: current.accentColor }}>
            BẢN MẪU KHỞI TẠO / STARTER TEMPLATE
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-light italic text-cream leading-tight">
            {current.title}
          </h1>
          <p className="text-[11px] text-cream/70 leading-relaxed font-light">
            {current.subtitle}
          </p>
          <div className="pt-2 flex gap-3 select-none">
            <button type="button" className="px-4 py-2 text-[9px] font-semibold uppercase tracking-wider rounded-xs text-cream bg-lacquer hover:brightness-110" style={{ backgroundColor: current.primaryColor }}>
              Khám phá sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Story Section */}
      <div className="py-10 px-6 border-b border-stone/20 bg-cream">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gold" style={{ color: current.accentColor }}>
              CÂU CHUYỆN DI SẢN / HISTORY
            </span>
            <h2 className="font-heading text-xl font-semibold text-charcoal italic leading-tight">
              {current.storyTitle}
            </h2>
            <p className="text-xs text-ash font-light leading-relaxed">
              {current.storyText}
            </p>
            <div className="border-l border-stone/50 pl-3 py-1 font-heading text-xs italic text-charcoal">
              {`"${current.artisan}"`}
            </div>
          </div>
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-stone/40 bg-stone/10 relative">
            <img src={current.heroImage} alt="Artisan work" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Dynamic Products Grid Section */}
      <div className="py-10 px-6 border-b border-stone/20 bg-parchment">
        <div className="text-center mb-8 space-y-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gold" style={{ color: current.accentColor }}>
            TRƯNG BÀY SẢN PHẨM / SHOWCASE
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Kiệt Tác Nghệ Thuật Độc Bản
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {current.products.map((prod, idx) => (
            <div key={idx} className="bg-cream border border-stone/40 rounded-xs overflow-hidden flex flex-col p-3 space-y-2">
              <div className="aspect-[4/3] w-full bg-stone/15 rounded-xs overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-heading text-sm text-charcoal italic font-medium truncate">
                {prod.name}
              </h4>
              <div className="flex justify-between items-center pt-1 border-t border-stone/20">
                <span className="text-xs font-semibold text-lacquer" style={{ color: current.primaryColor }}>
                  {prod.price}
                </span>
                <span className="text-[8px] uppercase tracking-wider font-semibold bg-stone/15 text-ash px-1 py-0.5 rounded-xs">
                  Xem chi tiết
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Experiences Section */}
      {current.hasExperiences && (
        <div className="py-10 px-6 border-b border-stone/20 bg-cream">
          <div className="text-center mb-8 space-y-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gold" style={{ color: current.accentColor }}>
              TRẢI NGHIỆM THỦ CÔNG / WORKSHOPS
            </span>
            <h2 className="font-heading text-xl font-semibold text-charcoal italic">
              Đăng Ký Khóa Học Di Sản
            </h2>
          </div>
          <div className="space-y-4">
            {current.experiences.map((exp, idx) => (
              <div key={idx} className="border border-stone/40 rounded-xs p-4 flex justify-between items-center bg-parchment">
                <div className="space-y-1 pr-4">
                  <h4 className="font-heading text-sm font-semibold text-charcoal italic">
                    {exp.title}
                  </h4>
                  <p className="text-[10px] text-ash font-light leading-relaxed max-w-sm">
                    {exp.desc}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold block text-lacquer" style={{ color: current.primaryColor }}>
                    {exp.price}
                  </span>
                  <button type="button" className="mt-1 px-3 py-1 bg-lacquer text-cream text-[8px] font-semibold uppercase tracking-wider rounded-xs" style={{ backgroundColor: current.primaryColor }}>
                    Đặt chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Footer */}
      <div className="py-8 px-6 bg-charcoal text-cream/60 text-center text-[10px] border-t border-stone/10 select-none">
        <p className="font-heading text-xs italic text-cream font-medium mb-1">
          HoaLang Platform
        </p>
        <p>Kiến tạo Không gian Mỹ nghệ số độc bản</p>
      </div>
    </div>
  );
}

interface TemplatePickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function TemplatePicker({
  selectedId,
  onSelect,
}: TemplatePickerProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateOption | null>(null);

  return (
    <div className="space-y-6 text-left select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATE_OPTIONS.map((tpl) => {
          const isSelected = selectedId === tpl.id;

          return (
            <motion.div
              key={tpl.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                onSelect(tpl.id);
                setPreviewTemplate(tpl);
              }}
              className={`bg-cream border rounded-sm overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? 'border-primary shadow-md ring-1 ring-primary/45'
                  : 'border-stone/60 hover:border-bronze shadow-sm'
              }`}
            >
              {/* Checked selection tag */}
              {isSelected && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground p-1 rounded-full z-15 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Template Cover Image with Quick View */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone/20 group">
                <img
                  src={tpl.mockImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                />
                
                {/* Floating Preview Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(tpl.id);
                    setPreviewTemplate(tpl);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-ink/75 hover:bg-ink text-cream hover:text-accent rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-semibold"
                >
                  <Eye className="w-3 h-3" />
                  <span>Xem thử / Preview</span>
                </button>
              </div>

              {/* Template Meta Contents */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-heading font-semibold text-lg text-charcoal italic leading-snug">
                    {tpl.name}
                  </h4>
                  <p className="font-sans text-xs text-ash font-light leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone/30">
                  {/* Theme swatch previews */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ash">
                      Bảng màu / Palette
                    </span>
                    <div className="flex gap-2">
                      <div
                        style={{ backgroundColor: tpl.primaryColor }}
                        className="w-4 h-4 rounded-full border border-stone/50 shadow-sm"
                        title="Primary Color"
                      />
                      <div
                        style={{ backgroundColor: tpl.accentColor }}
                        className="w-4 h-4 rounded-full border border-stone/50 shadow-sm"
                        title="Accent Color"
                      />
                    </div>
                  </div>

                  {/* Fonts pairings */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ash">
                      Phông chữ / Font
                    </span>
                    <span className="font-heading text-xs text-charcoal font-medium italic">
                      {tpl.fontHeading}
                    </span>
                  </div>

                  {/* Sections list overview */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ash block mb-1.5">
                      Phân mục / Layout Sections
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tpl.sections.map((sec) => (
                        <span
                          key={sec}
                          className="text-[8px] font-semibold uppercase tracking-wider bg-parchment text-ash/80 px-1.5 py-0.5 rounded-xs border border-stone/20"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Comp Mockup Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-70 flex items-center justify-center p-6 z-50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-parchment rounded-md shadow-lg max-w-3xl w-full border border-stone overflow-hidden relative flex flex-col max-h-[90vh]"
            >
              {/* Close header button */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-4 right-4 p-2 bg-cream hover:bg-stone/20 text-charcoal hover:text-primary rounded-full transition-colors z-50 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Cover preview scrollable */}
              <div className="p-6 md:p-8 flex flex-col overflow-hidden max-h-[90vh]">
                <div className="text-center mb-5 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block mb-1">
                    Bản Phác Thảo Giao Diện / Live Mockup
                  </span>
                  <h3 className="font-heading text-2xl font-semibold text-charcoal italic">
                    {previewTemplate.name}
                  </h3>
                  <p className="font-sans text-xs text-ash max-w-md mx-auto mt-1 leading-relaxed">
                    {previewTemplate.description}
                  </p>
                </div>

                {/* Desktop Browser Mock Frame */}
                <div className="border border-stone rounded-sm shadow-md overflow-hidden bg-cream flex flex-col flex-grow min-h-[300px]">
                  {/* Browser Bar */}
                  <div className="bg-stone/15 px-4 py-2 border-b border-stone/30 flex items-center gap-3 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                    </div>
                    <div className="bg-cream/80 text-[10px] text-ash font-mono py-0.5 px-3 rounded-xs border border-stone/20 flex-grow text-center max-w-md mx-auto select-all">
                      https://{previewTemplate.id.replace('-template', '')}.hoalang.site
                    </div>
                  </div>
                  
                  {/* Scrollable live preview container */}
                  <div className="overflow-y-auto max-h-[45vh] bg-stone/5 relative scrollbar-thin">
                    <TemplateLivePreview templateId={previewTemplate.id} />
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-6 shrink-0 select-none">
                  <button
                    onClick={() => {
                      onSelect(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                    className="bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[11px] px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all animate-ease-out"
                  >
                    Lựa chọn bản này / Apply Template
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="bg-transparent border border-stone text-charcoal font-sans font-semibold uppercase tracking-wider text-[11px] px-8 py-3.5 rounded-sm hover:bg-stone/10 transition-all"
                  >
                    Đóng / Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
