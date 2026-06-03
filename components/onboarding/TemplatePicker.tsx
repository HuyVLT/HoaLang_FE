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
                  
                  {/* Scrollable screenshot container */}
                  <div className="overflow-y-auto max-h-[45vh] bg-stone/5 select-none relative scrollbar-thin">
                    <img
                      src={previewTemplate.previewUrl}
                      alt="Visual template screenshot"
                      className="w-full h-auto object-contain block"
                    />
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
