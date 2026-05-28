'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, Reorder } from 'framer-motion';
import {
  Sparkles,
  Save,
  ArrowLeft,
  ChevronRight,
  Palette,
  LayoutGrid,
  FileText,
  Trash2,
  Plus,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { PageConfig, Section } from '@/types/tenant';
import { getMockTenantConfig } from '@/lib/mockTenants';
import TenantThemeProvider from '@/components/tenant/TenantThemeProvider';
import SectionRenderer from '@/components/tenant/SectionRenderer';

// Client API update helper
const savePageConfig = async (slug: string, config: PageConfig): Promise<boolean> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await axios.put(`${backendUrl}/tenant/${slug}/page-config`, {
      templateId: config.templateId,
      theme: config.theme,
      sections: config.sections,
    });
    return res.data && res.data.success;
  } catch (error) {
    console.error(`[PageConfigSave] Backend update failed, falling back to local simulation save:`, error);
    return false;
  }
};

interface BuilderProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default function VisualBuilder({ params }: BuilderProps) {
  const { slug } = params;
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'layout' | 'theme' | 'content'>('layout');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await axios.get(`${backendUrl}/tenant/${slug}/page-config`);
        if (res.data && res.data.success) {
          setConfig(res.data.data);
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (err) {
        const mock = getMockTenantConfig(slug);
        if (mock) {
          setConfig(JSON.parse(JSON.stringify(mock))); // Deep copy
        }
      }
      setLoading(false);
    };
    loadConfig();
  }, [slug]);

  const handleSave = async () => {
    if (!config) return;

    const success = await savePageConfig(slug, config);
    if (success) {
      toast.success('Đã lưu cấu hình di sản thành công!', {
        description: 'Landing page đã cập nhật giao diện mới nhất.',
      });
    } else {
      toast.info('Đã mô phỏng lưu cấu hình cục bộ thành công!', {
        description: 'Khởi chạy backend server để ghi dữ liệu trực tiếp vào MongoDB.',
      });
    }
  };

  // Section drag-and-drop order updates
  const handleReorder = (newSections: Section[]) => {
    if (!config) return;
    setConfig({ ...config, sections: newSections });
  };

  // Section simple move controllers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setConfig({ ...config, sections: newSections });
    toast.info('Đã thay đổi thứ tự bố cục!');
  };

  // Theme variable modifications
  const updateTheme = (key: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        [key]: value,
      },
    });
  };

  // Section content modifications
  const updateSectionText = (sectionId: string, path: string[], value: string, locale = 'vi') => {
    if (!config) return;
    const newSections = config.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;

      const updated = { ...sec } as any;
      let current = updated;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      if (current[lastKey] && typeof current[lastKey] === 'object') {
        current[lastKey][locale] = value;
      } else {
        current[lastKey] = value;
      }

      return updated;
    });

    setConfig({ ...config, sections: newSections });
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center p-8 select-none animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
          <span className="font-heading italic text-xl text-charcoal">Đang tải công cụ thiết kế...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-parchment overflow-hidden flex flex-col font-sans">
      {/* Visual Customizer Header */}
      <header className="bg-charcoal text-cream border-b border-stone/20 px-6 py-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-4">
          <a
            href={`/vi/tenant/${slug}`}
            className="p-2 hover:bg-cream/10 rounded-sm text-stone hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
              Hệ thống tùy biến / Customizer MVP
            </span>
            <h1 className="font-heading text-lg italic font-semibold">
              Thiết Kế Landing Page — {slug === 'bat-trang' ? 'Làng Gốm Bát Tràng' : 'Làng Lụa Vạn Phúc'}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[11px] px-6 py-2.5 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4 text-accent" />
          <span>Lưu Thay Đổi / Save</span>
        </button>
      </header>

      {/* Editor Split Screen Body */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Side: Customizer Sidebar Form Options */}
        <aside className="w-[420px] bg-cream border-r border-stone/50 flex flex-col overflow-hidden shrink-0 select-none">
          {/* Menu tab selection */}
          <div className="flex border-b border-stone/40 bg-parchment/50">
            {[
              { id: 'layout', icon: LayoutGrid, label: 'Bố Cục' },
              { id: 'theme', icon: Palette, label: 'Màu & Chữ' },
              { id: 'content', icon: FileText, label: 'Nội Dung' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-cream'
                    : 'border-transparent text-ash/80 hover:text-charcoal'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form controls content area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left">
            
            {/* TAB 1: SECTION REORDERING (DRAG AND DROP) */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <h3 className="font-heading text-xl italic text-charcoal border-b border-stone/30 pb-2">
                  Trình Tự Bố Cục (Reorder)
                </h3>
                <p className="text-xs text-ash leading-relaxed">
                  Kéo thả hoặc sử dụng các mũi tên để thay đổi trực quan thứ tự xuất hiện của các phân mục trên Landing Page.
                </p>

                {/* Draggable Reorder Group */}
                <Reorder.Group
                  axis="y"
                  values={config.sections}
                  onReorder={handleReorder}
                  className="space-y-2.5 pt-2"
                >
                  {config.sections.map((sec, index) => (
                    <Reorder.Item
                      key={sec.id}
                      value={sec}
                      className="bg-parchment border border-stone rounded-sm p-3.5 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-bronze shadow-sm hover:shadow-hover transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-accent/20 text-bronze font-semibold uppercase px-2 py-0.5 rounded-xs">
                          {sec.type}
                        </span>
                        <span className="font-sans font-medium text-sm text-charcoal capitalize">
                          {sec.id.replace(/-/g, ' ')}
                        </span>
                      </div>

                      {/* Direction Arrow buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-stone/20 disabled:opacity-30 rounded-xs transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(index, 'down');
                          }}
                          disabled={index === config.sections.length - 1}
                          className="p-1 hover:bg-stone/20 disabled:opacity-30 rounded-xs transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}

            {/* TAB 2: THEME STYLING CUSTOMIZER */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl italic text-charcoal border-b border-stone/30 pb-2 mb-4">
                    Giao Diện & Màu Sắc
                  </h3>
                  <div className="space-y-4">
                    {/* Primary color selector */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block mb-2">
                        Màu chính (Primary Color)
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={config.theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          className="w-10 h-10 border border-stone bg-transparent rounded-sm cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          className="flex-grow bg-transparent border-b border-stone text-sm text-ink px-2 py-1 focus:outline-none focus:border-bronze"
                        />
                      </div>
                    </div>

                    {/* Accent Color selector */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block mb-2">
                        Màu phụ trợ (Accent Color)
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={config.theme.accentColor}
                          onChange={(e) => updateTheme('accentColor', e.target.value)}
                          className="w-10 h-10 border border-stone bg-transparent rounded-sm cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.theme.accentColor}
                          onChange={(e) => updateTheme('accentColor', e.target.value)}
                          className="flex-grow bg-transparent border-b border-stone text-sm text-ink px-2 py-1 focus:outline-none focus:border-bronze"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font pairings selection */}
                <div>
                  <h3 className="font-heading text-xl italic text-charcoal border-b border-stone/30 pb-2 mb-4">
                    Kiểu Chữ (Typography Mood)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block mb-2">
                        Phông tiêu đề (Heading Font)
                      </label>
                      <select
                        value={config.theme.fontHeading}
                        onChange={(e) => updateTheme('fontHeading', e.target.value)}
                        className="w-full bg-cream border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                      >
                        <option value="Cormorant Garamond">Cormorant Garamond (Truyền thống cổ kính)</option>
                        <option value="Playfair Display">Playfair Display (Sang trọng đương đại)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Brand Logo URL */}
                <div>
                  <h3 className="font-heading text-xl italic text-charcoal border-b border-stone/30 pb-2 mb-4">
                    Biểu Trưng (Brand Logo)
                  </h3>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-ash block mb-2">
                      Đường dẫn ảnh Logo URL
                    </label>
                    <input
                      type="text"
                      value={config.theme.logo}
                      onChange={(e) => updateTheme('logo', e.target.value)}
                      className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze"
                      placeholder="https://example.com/logo.svg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT TEXT EDITORS */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="font-heading text-xl italic text-charcoal border-b border-stone/30 pb-2">
                  Chỉnh Sửa Nội Dung
                </h3>
                <p className="text-xs text-ash leading-relaxed">
                  Lựa chọn từng phần mục ở bên dưới để tùy biến nội dung văn bản trực quan.
                </p>

                <div className="space-y-3 pt-2">
                  {config.sections.map((sec) => (
                    <div key={sec.id} className="border border-stone rounded-sm overflow-hidden bg-parchment/30">
                      <button
                        onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                        className="w-full px-4 py-3 flex items-center justify-between font-sans text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-stone/10 select-none"
                      >
                        <span>{sec.id.replace(/-/g, ' ')}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-ash transition-transform duration-300 ${
                            editingSectionId === sec.id ? 'rotate-90' : 'rotate-0'
                          }`}
                        />
                      </button>

                      {editingSectionId === sec.id && (
                        <div className="p-4 border-t border-stone/40 bg-cream space-y-4">
                          
                          {/* HERO FORM FIELDS */}
                          {sec.type === 'hero' && (
                            <>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề chính (VI)
                                </label>
                                <textarea
                                  value={sec.title.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['title'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Phụ đề (VI)
                                </label>
                                <textarea
                                  value={sec.subtitle.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['subtitle'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Ảnh nền URL
                                </label>
                                <input
                                  type="text"
                                  value={sec.backgroundImage}
                                  onChange={(e) => updateSectionText(sec.id, ['backgroundImage'], e.target.value)}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                />
                              </div>
                            </>
                          )}

                          {/* STORY FORM FIELDS */}
                          {sec.type === 'story' && (
                            <>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề (VI)
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['heading'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Nội dung tự sự (VI)
                                </label>
                                <textarea
                                  value={sec.storyText.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['storyText'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                  rows={5}
                                />
                              </div>
                              {sec.artisanName && (
                                <div>
                                  <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                    Tên nghệ nhân (VI)
                                  </label>
                                  <input
                                    type="text"
                                    value={sec.artisanName.vi}
                                    onChange={(e) => updateSectionText(sec.id, ['artisanName'], e.target.value, 'vi')}
                                    className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                  />
                                </div>
                              )}
                            </>
                          )}

                          {/* PRODUCTS FORM FIELDS */}
                          {sec.type === 'products' && (
                            <>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề gốm sứ/lụa gấm (VI)
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['heading'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                />
                              </div>
                            </>
                          )}

                          {/* CTA FORM FIELDS */}
                          {sec.type === 'cta' && (
                            <>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Khẩu hiệu kêu gọi (VI)
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['heading'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Mô tả chi tiết (VI)
                                </label>
                                <textarea
                                  value={sec.description.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['description'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-sm text-ink focus:outline-none focus:border-bronze"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Right Side: LIVE RENDER PREVIEW PANEL (Interactive Direct State Sync!) */}
        <section className="flex-grow bg-stone/20 p-8 overflow-y-auto flex items-start justify-center relative select-none">
          {/* Dynamic real-time rendered overlay */}
          <div className="w-full max-w-[1200px] bg-parchment border border-stone/70 shadow-lg rounded-sm overflow-hidden min-h-[800px] flex flex-col relative scale-[0.98] origin-top transition-all duration-300">
            {/* Interactive Theme Wrapper and Direct State Sync Section Renders */}
            <TenantThemeProvider theme={config.theme}>
              {/* Header preview placeholder */}
              <div className="absolute top-0 left-0 right-0 py-5 px-10 flex items-center justify-between border-b border-stone/20 bg-parchment/40 backdrop-blur-xs z-40 text-ink pointer-events-none select-none">
                <span className="font-heading text-lg font-semibold tracking-wide flex items-center gap-2">
                  {config.theme.logo ? (
                    <img
                      src={config.theme.logo}
                      alt="Logo preview"
                      className="w-7 h-7 object-cover rounded-xs border border-stone/50 bg-cream"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span>HoaLang Preview</span>
                </span>
                <div className="flex gap-6 text-[10px] font-semibold uppercase tracking-wider font-sans opacity-70">
                  <span>Sản phẩm</span>
                  <span>Xưởng</span>
                  <span>Bản đồ</span>
                </div>
              </div>
              <div className="flex flex-col pt-0">
                <SectionRenderer sections={config.sections} />
              </div>
            </TenantThemeProvider>
          </div>

          {/* Floating preview notice tag */}
          <span className="absolute bottom-6 right-8 bg-charcoal text-cream text-[9px] uppercase font-semibold tracking-widest px-3 py-1 border border-stone/20 rounded-xs select-none shadow-md z-50">
            Live Preview (60 FPS Direct Sync)
          </span>
        </section>

      </div>
    </div>
  );
}
