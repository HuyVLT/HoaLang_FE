'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, X, Maximize2, Minimize2 } from 'lucide-react';

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

function PotteryTemplatePreview() {
  const vars = {
    '--primary-color': '#8B5A2B',
    '--accent-color': '#C4952A',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  } as React.CSSProperties;

  return (
    <div style={vars} className="w-full text-ink text-left bg-[#F5F0E8] leading-relaxed font-sans overflow-hidden">
      {/* Nav */}
      <div className="border-b border-stone/30 py-3 px-6 flex items-center justify-between bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider">
        <span className="font-heading text-lg font-bold select-none italic text-[#8B5A2B]">
          Bát Tràng Cổ Nghệ
        </span>
        <div className="flex gap-4 text-[10px] text-ash">
          <span className="hover:text-ink">Bộ Sưu Tập</span>
          <span className="hover:text-ink">Trải Nghiệm Đất Sét</span>
          <span className="hover:text-ink">Về Làng Nghề</span>
        </div>
      </div>

      {/* Hero: Asymmetric Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-stone/20">
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-4 bg-[#F5F0E8]">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C4952A]">
            DI SẢN TRÀNG AN / HERITAGE
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-light italic text-charcoal leading-tight">
            Hồn Đất Gia Lâm <br/> Gốm Sứ Bát Tràng
          </h1>
          <p className="text-[11px] text-ash leading-relaxed font-light max-w-sm">
            Nơi lưu giữ nét đẹp tinh xảo hơn 700 năm của nghệ thuật nhào nặn đất sét và lửa men rạn trứ danh.
          </p>
          <div className="pt-2">
            <button type="button" className="px-5 py-2.5 text-[9px] font-semibold uppercase tracking-wider rounded-xs text-cream bg-[#8B5A2B] hover:brightness-110 shadow-sm">
              Khám phá sản phẩm
            </button>
          </div>
        </div>
        <div className="md:col-span-5 aspect-[4/3] md:aspect-auto min-h-[220px] bg-stone/20 relative">
          <img src="/images/village-bat-trang.png" alt="Pottery Hero" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      {/* Story: Asymmetric Side-by-Side */}
      <div className="py-12 px-6 bg-[#FAF7F2] border-b border-stone/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
              TINH HOA CHẾ TÁC / ARTISTRY
            </span>
            <h2 className="font-heading text-xl font-semibold text-charcoal italic leading-tight">
              Hành Trình Tinh Tế Của Đất & Lửa
            </h2>
            <p className="text-xs text-ash font-light leading-relaxed">
              Để làm nên một tác phẩm gốm Bát Tràng trứ danh, người nghệ nhân phải trải qua quy trình nghiêm ngặt từ chọn đất tràng sét, lắng lọc bùn mịn, xoay chuốt trên bàn xoay thủ công và nung lò đạt tới 1200 độ C.
            </p>
            <div className="border-l-2 border-[#8B5A2B] pl-3 py-1 font-heading text-xs italic text-charcoal">
              &quot;Mỗi chiếc bình gốm là một bài thơ về đất.&quot;<br/>
              <span className="text-[10px] text-ash not-italic font-sans font-medium block mt-1">— Nghệ nhân Nguyễn Văn Minh</span>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-sm overflow-hidden border border-stone/40 bg-stone/10">
            <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80" alt="Pottery Story" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Products: Asymmetrical Grid */}
      <div className="py-12 px-6 border-b border-stone/20 bg-[#F5F0E8]">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            BỘ SƯU TẬP / COLLECTIONS
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Kiệt Tác Nghệ Thuật Độc Bản
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF7F2] border border-stone/40 rounded-sm p-4 space-y-3">
            <div className="aspect-[16/10] w-full bg-stone/15 rounded-xs overflow-hidden">
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80" alt="Product 1" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-heading text-sm text-charcoal font-semibold italic">Bình Hút Lộc Vẽ Vàng</h4>
                <span className="text-[10px] text-ash">Men lam rạn cổ, vàng 24K</span>
              </div>
              <span className="text-xs font-bold text-[#8B5A2B] shrink-0">1.850.000 ₫</span>
            </div>
          </div>
          <div className="bg-[#FAF7F2] border border-stone/40 rounded-sm p-4 space-y-3 md:translate-y-4">
            <div className="aspect-[16/10] w-full bg-stone/15 rounded-xs overflow-hidden">
              <img src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80" alt="Product 2" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-heading text-sm text-charcoal font-semibold italic">Bộ Ấm Trà Cổ Điển</h4>
                <span className="text-[10px] text-ash">Họa tiết trúc lâm thất hiền</span>
              </div>
              <span className="text-xs font-bold text-[#8B5A2B] shrink-0">950.000 ₫</span>
            </div>
          </div>
        </div>
        <div className="h-6 md:h-10" />
      </div>

      {/* Experiences: Step list Cards */}
      <div className="py-12 px-6 bg-[#FAF7F2] border-b border-stone/20">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            HÀNH TRÌNH TRẢI NGHIỆM / WORKSHOPS
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Học Cách Nặn Gốm Bát Tràng
          </h2>
        </div>
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="flex gap-4 p-4 border border-stone/40 rounded-sm bg-[#F5F0E8]">
            <span className="font-heading text-2xl font-bold text-[#C4952A] shrink-0 select-none">01</span>
            <div className="space-y-1">
              <h4 className="font-heading text-sm font-semibold text-charcoal italic">Tạo Hình Trên Bàn Xoay</h4>
              <p className="text-[10px] text-ash leading-relaxed">Đích thân nhào nặn đất sét dưới sự kèm cặp từ truyền nhân làng nghề Bát Tràng.</p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B5A2B]">250.000 ₫</span>
                <span className="text-[8px] font-semibold uppercase tracking-widest text-[#8B5A2B] border-b border-[#8B5A2B] pb-0.5">Đặt Chỗ Trực Tiếp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery: Asymmetric 4-image grid */}
      <div className="py-12 px-6 bg-[#F5F0E8] border-b border-stone/20">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            KHOẢNH KHẮC DI SẢN / GALLERY
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Góc Nhìn Nghệ Thuật Làng Gốm
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-4 max-w-xl mx-auto">
          <div className="col-span-8 aspect-[4/3] overflow-hidden border border-stone/40 bg-stone/10 rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80" 
              alt="Gallery 1" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
          <div className="col-span-4 aspect-[3/4] overflow-hidden border border-stone/40 bg-stone/10 rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&q=80" 
              alt="Gallery 2" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
          <div className="col-span-4 aspect-[3/4] overflow-hidden border border-stone/40 bg-stone/10 rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1565192647048-f997ded879ab?w=400&q=80" 
              alt="Gallery 3" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
          <div className="col-span-8 aspect-[4/3] overflow-hidden border border-stone/40 bg-stone/10 rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80" 
              alt="Gallery 4" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-6 bg-charcoal text-cream/50 text-center text-[10px]">
        <p className="font-heading text-xs italic text-cream font-medium mb-1">Gốm Sứ Bát Tràng</p>
        <p>© 2026 HoaLang Heritage Atlas. All rights reserved.</p>
      </div>
    </div>
  );
}

function SilkTemplatePreview() {
  const vars = {
    '--primary-color': '#8B1A1A',
    '--accent-color': '#C4952A',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  } as React.CSSProperties;

  return (
    <div style={vars} className="w-full text-ink text-left bg-[#FAF7F2] leading-relaxed font-sans overflow-hidden">
      {/* Nav: Centered logo and stacked navigation */}
      <div className="border-b border-stone/30 py-4 px-6 flex flex-col items-center gap-2 bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider">
        <span className="font-heading text-xl font-bold select-none tracking-widest text-[#8B1A1A]">
          VẠN PHÚC SILK
        </span>
        <div className="flex gap-6 text-[9px] text-ash tracking-widest">
          <span className="hover:text-ink">LỤA QUÝ</span>
          <span className="hover:text-ink">TRẢI NGHIỆM NHUỘM</span>
          <span className="hover:text-ink">HÀNH TRÌNH TƠ TẰM</span>
        </div>
      </div>

      {/* Hero: Framed Center Box inside dark overlay */}
      <div className="relative border-b border-stone/20 overflow-hidden flex items-center justify-center p-8 min-h-[300px] bg-charcoal text-cream">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: "url('/images/village-van-phuc.png')" }} />
        <div className="relative z-10 max-w-md w-full border border-[#C4952A]/60 bg-charcoal/80 p-6 md:p-8 text-center space-y-3">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-gold text-[#C4952A]">
            KIỆT TÁC KINH KỲ / LUXURY HERITAGE
          </span>
          <h1 className="font-heading text-xl md:text-2xl font-light text-cream leading-tight">
            Vương Triều Tơ Tằm <br/> Lụa Vạn Phúc
          </h1>
          <div className="w-12 h-[1px] bg-[#C4952A] mx-auto my-2" />
          <p className="text-[10px] text-cream/70 leading-relaxed font-light">
            Lộng lẫy tơ tằm óng ả đậm hơi thở cung đình, mang hồn cốt nghìn năm đất kinh kỳ văn hiến.
          </p>
          <div className="pt-2 select-none">
            <button type="button" className="px-6 py-2.5 text-[8px] font-semibold uppercase tracking-widest rounded-none text-cream bg-[#8B1A1A] hover:brightness-110 shadow-sm border border-[#8B1A1A]">
              KHÁM PHÁ CÁC MẪU LỤA
            </button>
          </div>
        </div>
      </div>

      {/* Story: Full width Quote & Wide Editorial Image */}
      <div className="py-12 px-6 bg-[#F5F0E8] border-b border-stone/20 text-center space-y-6">
        <div className="max-w-lg mx-auto space-y-3">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            NGUỒN CỘI LỤA LÀ / HISTORICAL TEXTURE
          </span>
          <h2 className="font-heading text-lg font-bold text-charcoal italic leading-relaxed">
            &quot;Từng tấm lụa Hà Đông tơ tằm nguyên bản được dệt tay khéo léo trên các khung gỗ cổ truyền, trải qua công đoạn nhuộm tự nhiên và phơi nắng tạo nên độ óng mịn hoàn hảo.&quot;
          </h2>
          <span className="text-[10px] text-ash font-sans block mt-1">— Nghệ nhân nhân dân Triệu Văn Mão</span>
        </div>
        <div className="aspect-[16/9] w-full max-w-xl mx-auto rounded-none overflow-hidden border border-stone/40 bg-stone/10">
          <img src="/images/village-van-phuc.png" alt="Silk Story" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Products: Alternating Rows List */}
      <div className="py-12 px-6 border-b border-stone/20 bg-[#FAF7F2]">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            SẢN VẬT HOÀNG GIA / PREMIUM PRODUCTS
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Giao Thương Trực Tiếp Nghệ Nhân
          </h2>
        </div>
        
        <div className="space-y-8 max-w-xl mx-auto">
          {/* Alternating Product 1: Image Left, Text Right */}
          <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-stone/20 pb-6">
            <div className="w-full sm:w-1/3 aspect-square bg-stone/15 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80" alt="Silk product 1" className="w-full h-full object-cover" />
            </div>
            <div className="w-full sm:w-2/3 space-y-2">
              <h4 className="font-heading text-md text-charcoal font-semibold">Khăn Lụa Hà Đông Thêu Sen</h4>
              <p className="text-[10px] text-ash font-light leading-relaxed">Khăn lụa tơ tằm dệt tay truyền thống, thêu tay họa tiết hoa sen đầm ấm đậm chất Việt Nam.</p>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-[#8B1A1A]">450.000 ₫</span>
                <span className="text-[9px] uppercase tracking-widest text-gold text-[#C4952A] font-semibold">Chi tiết ↗</span>
              </div>
            </div>
          </div>

          {/* Alternating Product 2: Text Left, Image Right */}
          <div className="flex flex-col sm:flex-row-reverse gap-6 items-center">
            <div className="w-full sm:w-1/3 aspect-square bg-stone/15 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80" alt="Silk product 2" className="w-full h-full object-cover" />
            </div>
            <div className="w-full sm:w-2/3 space-y-2">
              <h4 className="font-heading text-md text-charcoal font-semibold">Áo Dài Gấm Vạn Phúc</h4>
              <p className="text-[10px] text-ash font-light leading-relaxed">Thiết kế áo dài cổ điển từ gấm Vạn Phúc loại thượng hạng, hoa văn ẩn lấp lánh sang trọng.</p>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-[#8B1A1A]">2.800.000 ₫</span>
                <span className="text-[9px] uppercase tracking-widest text-gold text-[#C4952A] font-semibold">Chi tiết ↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experiences: Menu Layout */}
      <div className="py-12 px-6 bg-[#F5F0E8] border-b border-stone/20">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            THỂ NGHIỆM NGHỆ THUẬT / SERVICES
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Trải Nghiệm Độc Bản Tại Làng Nghề
          </h2>
        </div>
        <div className="max-w-xl mx-auto p-6 border-2 border-double border-[#C4952A]/40 bg-[#FAF7F2] space-y-4">
          <div className="flex justify-between items-baseline gap-2">
            <span className="font-heading text-sm font-semibold text-charcoal">Học Nhuộm Lụa Tự Nhiên</span>
            <span className="flex-grow border-b border-dashed border-stone" />
            <span className="text-xs font-bold text-[#8B1A1A]">420.000 ₫</span>
          </div>
          <p className="text-[10px] text-ash font-light leading-relaxed max-w-md -mt-2">
            Học cách sử dụng lá cây rừng, củ nâu nhuộm màu truyền thống trên nền vải lụa tơ tằm nguyên chất.
          </p>
        </div>
      </div>

      {/* Gallery: 3-column with middle item translated down */}
      <div className="py-12 px-6 bg-[#FAF7F2] border-b border-stone/20">
        <div className="text-center mb-10 space-y-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C4952A]">
            DÒNG CHẢY TƠ TẰM / VISUAL JOURNAL
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Góc Nhỏ Của Nghệ Thuật Dệt Thủ Công
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto items-center pb-6">
          <div className="aspect-[3/4] overflow-hidden border border-stone/40 bg-stone/10 rounded-none">
            <img 
              src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80" 
              alt="Silk Gallery 1" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden border border-stone/40 bg-stone/10 rounded-none translate-y-3">
            <img 
              src="https://images.unsplash.com/photo-1601921004897-b7d582836990?w=400&q=80" 
              alt="Silk Gallery 2" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden border border-stone/40 bg-stone/10 rounded-none">
            <img 
              src="https://images.unsplash.com/photo-1528154291023-a6525fabb5b0?w=400&q=80" 
              alt="Silk Gallery 3" 
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" 
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 px-6 bg-charcoal text-cream/40 text-center text-[9px] uppercase tracking-widest">
        <p className="font-heading text-xs italic text-[#C4952A] font-medium mb-1">Vạn Phúc Silk Gallery</p>
        <p>© 2026 HoaLang Digital Atlas</p>
      </div>
    </div>
  );
}

function MinimalTemplatePreview() {
  const vars = {
    '--primary-color': '#2E2318',
    '--accent-color': '#7A5C2E',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  } as React.CSSProperties;

  return (
    <div style={vars} className="w-full text-ink text-left bg-[#FAF7F2] leading-relaxed font-sans overflow-hidden">
      {/* Nav: Minimal inline text */}
      <div className="py-4 px-6 flex items-center justify-between bg-[#FAF7F2] text-[9px] font-semibold uppercase tracking-widest text-ash">
        <span className="font-heading text-base font-bold select-none text-[#2E2318]">
          ĐÔNG HỒ / DÓ
        </span>
        <div className="flex gap-4">
          <span className="hover:text-ink">Tranh cổ</span>
          <span className="hover:text-ink">Quy trình</span>
        </div>
      </div>

      {/* Hero: Typographical Zen Hero (No background image!) */}
      <div className="border-b border-stone/20 py-16 px-6 bg-[#FAF7F2] text-center space-y-4">
        <span className="text-[8px] font-semibold uppercase tracking-widest text-[#7A5C2E]">
          TRUYỀN THUYẾT DÂN GIAN / DONG HO ART
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-light text-[#2E2318] leading-tight">
          Nghệ Thuật Tranh Đông Hồ <br/> & Điệp Giấy Dó
        </h1>
        <div className="flex items-center justify-center gap-2 text-stone">
          <span>◆</span>
          <span className="w-16 h-[1px] bg-stone/60" />
          <span>◆</span>
        </div>
        <p className="text-[10px] text-ash max-w-sm mx-auto leading-relaxed font-light">
          Sự tinh giản mộc mạc lưu giữ hồn cội nguồn văn hóa Việt trên nền điệp óng ánh dệt từ vỏ điệp sò biển khơi.
        </p>
        <div className="pt-2">
          <button type="button" className="px-6 py-2 border border-charcoal text-[#2E2318] text-[9px] font-semibold uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors">
            Xem Các Bản Tranh
          </button>
        </div>
      </div>

      {/* Story: Single Column Typography-First */}
      <div className="py-12 px-6 bg-[#FAF7F2] border-b border-stone/20">
        <div className="max-w-md mx-auto space-y-4 text-center">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-[#7A5C2E]">
            MÀU SẮC TỰ NHIÊN / ORGANIC MATERIALS
          </span>
          <h2 className="font-heading text-xl font-semibold text-charcoal italic">
            Khắc Họa Linh Hồn Việt Trên Điệp Dó
          </h2>
          <p className="text-xs text-ash font-light leading-relaxed text-justify">
            Mỗi bức tranh Đông Hồ tự hào chắt chiu từ năm màu tự nhiên mộc mạc: màu đen óng từ than lá tre, đỏ từ sỏi đồi nung gạch, vàng từ hạt dành dành, xanh lục từ chàm rừng và trắng từ điệp sò nghiền mịn quét lên giấy dó dẻo dai.
          </p>
          <div className="aspect-[4/3] w-48 mx-auto rounded-none overflow-hidden border border-stone/30 bg-stone/5 mt-4">
            <img src="/images/village-dong-ho.png" alt="Dong Ho Story" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Products: Simple Minimalist 2-column Grid */}
      <div className="py-12 px-6 border-b border-stone/20 bg-[#FAF7F2]">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-[#7A5C2E]">
            GIAO THƯƠNG / BOUTIQUE
          </span>
          <h2 className="font-heading text-lg font-semibold text-charcoal italic">
            Ấn Phẩm Tranh Khắc Gỗ
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
          <div className="space-y-2 text-center">
            <div className="aspect-[1/1] w-full bg-stone/5 border border-stone/30 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80" alt="Minimal product 1" className="w-full h-full object-cover filter grayscale contrast-125" />
            </div>
            <h4 className="font-heading text-xs text-charcoal font-semibold">Tranh Đàn Lợn Âm Dương</h4>
            <span className="text-[10px] text-ash font-light block">320.000 ₫</span>
          </div>

          <div className="space-y-2 text-center">
            <div className="aspect-[1/1] w-full bg-stone/5 border border-stone/30 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80" alt="Minimal product 2" className="w-full h-full object-cover filter grayscale contrast-125" />
            </div>
            <h4 className="font-heading text-xs text-charcoal font-semibold">Tranh Vinh Hoa Phú Quý</h4>
            <span className="text-[10px] text-ash font-light block">320.000 ₫</span>
          </div>
        </div>
      </div>

      {/* Gallery: 3-column grayscale grid */}
      <div className="py-12 px-6 border-b border-stone/20 bg-[#FAF7F2]">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-[#7A5C2E]">
            DI SẢN TRỰC QUAN / MINIMAL JOURNAL
          </span>
          <h2 className="font-heading text-lg font-semibold text-charcoal italic">
            Nét Khắc Thời Gian
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          <div className="aspect-[1/1] overflow-hidden border border-stone/30 bg-stone/5 filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80" 
              alt="Dong Ho Gallery 1" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="aspect-[1/1] overflow-hidden border border-stone/30 bg-stone/5 filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80" 
              alt="Dong Ho Gallery 2" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="aspect-[1/1] overflow-hidden border border-stone/30 bg-stone/5 filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80" 
              alt="Dong Ho Gallery 3" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* CTA: Underline input signup */}
      <div className="py-12 px-6 bg-[#FAF7F2] text-center border-b border-stone/20">
        <div className="max-w-xs mx-auto space-y-3">
          <h4 className="font-heading text-md font-semibold text-charcoal italic">Đồng hành cùng di sản</h4>
          <p className="text-[9px] text-ash leading-relaxed">Để lại email để nhận thông tin về các buổi triển lãm tranh dó truyền thống.</p>
          <div className="flex border-b border-stone py-1">
            <input type="email" placeholder="Địa chỉ email..." className="w-full bg-transparent text-[10px] text-ink focus:outline-none placeholder:text-ash/50 placeholder:font-light" />
            <button type="button" className="text-[9px] uppercase tracking-wider font-semibold text-[#7A5C2E]">Gửi</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-6 bg-[#FAF7F2] text-ash text-center text-[9px]">
        <p className="font-heading text-xs italic text-[#2E2318] font-medium mb-1">Mực nghiên Điệp dó</p>
        <p>© 2026 HoaLang Platform</p>
      </div>
    </div>
  );
}

function TemplateLivePreview({ templateId }: { templateId: string }) {
  if (templateId === 'pottery-template') {
    return <PotteryTemplatePreview />;
  }
  if (templateId === 'silk-template') {
    return <SilkTemplatePreview />;
  }
  return <MinimalTemplatePreview />;
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
              initial={isFullscreen ? { scale: 1, y: 0 } : { scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={isFullscreen ? { scale: 1, y: 0 } : { scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`bg-parchment border-stone overflow-hidden relative flex flex-col transition-all duration-300 ${
                isFullscreen 
                  ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none border-none z-50' 
                  : 'bg-parchment rounded-md shadow-lg max-w-3xl w-full border max-h-[90vh]'
              }`}
            >
              {/* Fullscreen & Close header buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-cream hover:bg-stone/20 text-charcoal hover:text-primary rounded-full transition-colors shadow-sm"
                  title={isFullscreen ? 'Thu nhỏ / Exit Fullscreen' : 'Phóng to / Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTemplate(null);
                    setIsFullscreen(false);
                  }}
                  className="p-2 bg-cream hover:bg-stone/20 text-charcoal hover:text-primary rounded-full transition-colors shadow-sm"
                  title="Đóng / Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Cover preview scrollable */}
              <div className={`p-6 md:p-8 flex flex-col overflow-hidden transition-all duration-300 ${
                isFullscreen ? 'h-full max-h-none' : 'max-h-[90vh]'
              }`}>
                <div className="text-center mb-5 shrink-0 pr-16 pl-16">
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
                  <div className={`overflow-y-auto bg-stone/5 relative scrollbar-thin flex-grow transition-all duration-300 ${
                    isFullscreen ? 'max-h-none' : 'max-h-[45vh]'
                  }`}>
                    <TemplateLivePreview templateId={previewTemplate.id} />
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-6 shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(previewTemplate.id);
                      setPreviewTemplate(null);
                      setIsFullscreen(false);
                    }}
                    className="bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[11px] px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all animate-ease-out"
                  >
                    Lựa chọn bản này / Apply Template
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTemplate(null);
                      setIsFullscreen(false);
                    }}
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
