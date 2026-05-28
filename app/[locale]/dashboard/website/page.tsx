'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, Reorder } from 'framer-motion';
import {
  Sparkles,
  Save,
  ChevronRight,
  Palette,
  LayoutGrid,
  FileText,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { PageConfig, Section } from '@/types/tenant';
import { getMockTenantConfig } from '@/lib/mockTenants';
import TenantThemeProvider from '@/components/tenant/TenantThemeProvider';
import SectionRenderer from '@/components/tenant/SectionRenderer';
import PublishPanel from '@/components/dashboard/PublishPanel';

// Client API update helper
const savePageConfig = async (slug: string, config: PageConfig): Promise<boolean> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await axios.put(`${backendUrl}/tenant/${slug}/page-config`, {
      templateId: config.templateId,
      theme: config.theme,
      sections: config.sections,
      published: config.published,
    });
    return res.data && res.data.success;
  } catch (error) {
    console.error(`[PageConfigSave] Backend update failed, falling back to local simulation:`, error);
    return false;
  }
};

export default function WebsiteEditor() {
  const [tenantSlug, setTenantSlug] = useState('bat-trang');
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'layout' | 'theme' | 'content'>('layout');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    // Read slug from URL search params or fallback to session storage / bat-trang
    const searchParams = new URLSearchParams(window.location.search);
    const slugParam = searchParams.get('slug') || sessionStorage.getItem('hoalang_tenant_slug') || 'bat-trang';
    setTenantSlug(slugParam);

    const loadConfig = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await axios.get(`${backendUrl}/tenant/${slugParam}/page-config`);
        if (res.data && res.data.success) {
          setConfig(res.data.data);
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (err) {
        const mock = getMockTenantConfig(slugParam);
        if (mock) {
          setConfig(JSON.parse(JSON.stringify(mock)));
        }
      }
      setLoading(false);
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;

    const success = await savePageConfig(tenantSlug, config);
    if (success) {
      toast.success('Đã lưu cấu hình thiết kế thành công!', {
        description: 'Landing page của bạn đã đồng bộ dữ liệu mới nhất.',
      });
    } else {
      toast.info('Đã mô phỏng lưu cấu hình cục bộ thành công!', {
        description: 'Khởi chạy backend server để ghi dữ liệu trực tiếp vào MongoDB.',
      });
    }
  };

  const handlePublishStatusChange = (newStatus: boolean) => {
    if (!config) return;
    setConfig({ ...config, published: newStatus });
  };

  const handleReorder = (newSections: Section[]) => {
    if (!config) return;
    setConfig({ ...config, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setConfig({ ...config, sections: newSections });
  };

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
      <div className="h-full w-full bg-parchment flex items-center justify-center p-8 select-none animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
          <span className="font-heading italic text-xl text-charcoal">Đang tải cấu hình tùy biến...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col overflow-hidden h-full">
      {/* 1. Header Toolbar incorporating Publish Console */}
      <div className="p-4 border-b border-stone/30 bg-parchment/65 shrink-0 flex flex-col gap-3">
        <div className="flex justify-between items-center select-none">
          <div className="text-left">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gold font-sans block">
              PHÂN HỆ TÙY BIẾN GIAO DIỆN / DESIGN CONSOLE
            </span>
            <h2 className="font-heading text-xl italic font-semibold text-charcoal">
              Thiết Kế Mỹ Thuật Landing Page
            </h2>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-6 py-2 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all shrink-0"
          >
            <Save className="w-3.5 h-3.5 text-accent" />
            <span>Lưu Thay Đổi / Save</span>
          </button>
        </div>

        <PublishPanel
          tenantSlug={tenantSlug}
          isPublished={config.published}
          onStatusChange={handlePublishStatusChange}
        />
      </div>

      {/* 2. Visual Builder Workspace split pane */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Sidebar controls */}
        <aside className="w-[360px] bg-cream border-r border-stone/50 flex flex-col overflow-hidden shrink-0 select-none">
          {/* Customizer Tabs */}
          <div className="flex border-b border-stone/40 bg-parchment/50">
            {[
              { id: 'layout', icon: LayoutGrid, label: 'Bố cục' },
              { id: 'theme', icon: Palette, label: 'Chủ đề' },
              { id: 'content', icon: FileText, label: 'Nội dung' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-cream'
                    : 'border-transparent text-ash/80 hover:text-charcoal'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form scroll inputs */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6 text-left">
            
            {/* TAB 1: Bố cục / Layout (Drag and drop) */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <h4 className="font-heading text-lg italic text-charcoal border-b border-stone/30 pb-2">
                  Trình tự phân mục (Reorder)
                </h4>
                
                <Reorder.Group
                  axis="y"
                  values={config.sections}
                  onReorder={handleReorder}
                  className="space-y-2 pt-2"
                >
                  {config.sections.map((sec, idx) => (
                    <Reorder.Item
                      key={sec.id}
                      value={sec}
                      className="bg-parchment border border-stone rounded-sm p-3 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-bronze shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-accent/25 text-bronze font-semibold uppercase px-2 py-0.5 rounded-xs select-none">
                          {sec.type}
                        </span>
                        <span className="font-sans font-medium text-xs text-charcoal capitalize">
                          {sec.id.replace(/-/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 hover:bg-stone/20 disabled:opacity-30 rounded-xs"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, 'down');
                          }}
                          disabled={idx === config.sections.length - 1}
                          className="p-1 hover:bg-stone/20 disabled:opacity-30 rounded-xs"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}

            {/* TAB 2: Chủ đề / Theme settings */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                <h4 className="font-heading text-lg italic text-charcoal border-b border-stone/30 pb-2">
                  Bảng màu & Biểu trưng
                </h4>
                
                {/* Primary Color selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-ash block">
                    Màu chính (Primary)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      className="w-8 h-8 border border-stone bg-transparent rounded-sm cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      className="flex-grow bg-transparent border-b border-stone text-xs text-ink px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Accent Color selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-ash block">
                    Màu phụ trợ (Accent)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.theme.accentColor}
                      onChange={(e) => updateTheme('accentColor', e.target.value)}
                      className="w-8 h-8 border border-stone bg-transparent rounded-sm cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.theme.accentColor}
                      onChange={(e) => updateTheme('accentColor', e.target.value)}
                      className="flex-grow bg-transparent border-b border-stone text-xs text-ink px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Heading font pairing */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-ash block">
                    Kiểu tiêu đề (Heading Font)
                  </label>
                  <select
                    value={config.theme.fontHeading}
                    onChange={(e) => updateTheme('fontHeading', e.target.value)}
                    className="w-full bg-cream border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Truyền thống)</option>
                    <option value="Playfair Display">Playfair Display (Sang trọng)</option>
                  </select>
                </div>

                {/* Brand Logo URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-ash block">
                    Biểu trưng thương hiệu / Logo URL
                  </label>
                  <input
                    type="text"
                    value={config.theme.logo}
                    onChange={(e) => updateTheme('logo', e.target.value)}
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Nội dung / Content forms */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h4 className="font-heading text-lg italic text-charcoal border-b border-stone/30 pb-2">
                  Biên tập văn bản
                </h4>

                <div className="space-y-3 pt-2">
                  {config.sections.map((sec) => (
                    <div key={sec.id} className="border border-stone rounded-sm overflow-hidden bg-parchment/30">
                      <button
                        onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                        className="w-full px-4 py-2.5 flex items-center justify-between font-sans text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-stone/10"
                      >
                        <span>{sec.id.replace(/-/g, ' ')}</span>
                        <span className="text-[8px] bg-stone/30 px-1 rounded-xs">{sec.type}</span>
                      </button>

                      {editingSectionId === sec.id && (
                        <div className="p-3.5 border-t border-stone/40 bg-cream space-y-4">
                          {/* HERO CONTENT FORM */}
                          {sec.type === 'hero' && (
                            <>
                              <div>
                                <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề chính (VI)
                                </label>
                                <textarea
                                  value={sec.title.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['title'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Nội dung phụ đề (VI)
                                </label>
                                <textarea
                                  value={sec.subtitle.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['subtitle'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {/* STORY CONTENT FORM */}
                          {sec.type === 'story' && (
                            <>
                              <div>
                                <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề câu chuyện (VI)
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['heading'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tự sự câu chuyện (VI)
                                </label>
                                <textarea
                                  value={sec.storyText.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['storyText'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                                  rows={4}
                                />
                              </div>
                              {sec.artisanName && (
                                <div>
                                  <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                    Nghệ nhân đại diện (VI)
                                  </label>
                                  <input
                                    type="text"
                                    value={sec.artisanName.vi}
                                    onChange={(e) => updateSectionText(sec.id, ['artisanName'], e.target.value, 'vi')}
                                    className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
                                  />
                                </div>
                              )}
                            </>
                          )}

                          {/* CTA CONTENT FORM */}
                          {sec.type === 'cta' && (
                            <>
                              <div>
                                <label className="text-[9px] font-semibold text-ash uppercase tracking-wider block mb-1">
                                  Tiêu đề kêu gọi (VI)
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading.vi}
                                  onChange={(e) => updateSectionText(sec.id, ['heading'], e.target.value, 'vi')}
                                  className="w-full bg-parchment/60 border border-stone rounded-sm p-2 text-xs text-ink focus:outline-none"
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

        {/* Right Side: LIVE PREVIEW CONTAINER (Interactive directly inside React state!) */}
        <section className="flex-grow bg-stone/20 p-8 overflow-y-auto flex items-start justify-center relative select-none">
          <div className="w-full max-w-[1200px] bg-parchment border border-stone/70 shadow-lg rounded-sm overflow-hidden min-h-[700px] flex flex-col relative scale-[0.98] origin-top transition-all duration-300">
            <TenantThemeProvider theme={config.theme}>
              {/* Floating preview top bar */}
              <div className="absolute top-0 left-0 right-0 py-4.5 px-8 flex items-center justify-between border-b border-stone/20 bg-parchment/40 backdrop-blur-xs z-45 text-ink pointer-events-none select-none">
                <span className="font-heading text-lg font-semibold tracking-wide flex items-center gap-2">
                  {config.theme.logo ? (
                    <img
                      src={config.theme.logo}
                      alt="Mini Logo"
                      className="w-6.5 h-6.5 object-cover rounded-xs border border-stone/50 bg-cream"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span>HoaLang Preview</span>
                </span>
                <div className="flex gap-5 text-[9px] font-semibold uppercase tracking-wider font-sans opacity-70">
                  <span>Sản phẩm</span>
                  <span>Trải nghiệm</span>
                  <span>Bản đồ</span>
                </div>
              </div>
              <div className="flex flex-col pt-0">
                <SectionRenderer sections={config.sections} />
              </div>
            </TenantThemeProvider>
          </div>

          <span className="absolute bottom-6 right-8 bg-charcoal text-cream text-[9px] uppercase font-semibold tracking-widest px-3 py-1 border border-stone/20 rounded-xs select-none shadow-md z-50">
            Live Preview (60 FPS Direct Sync)
          </span>
        </section>
      </div>

    </div>
  );
}
export { WebsiteEditor };
