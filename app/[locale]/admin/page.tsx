'use client';

import React, { useState } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Database,
  Globe,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Power
} from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';


interface TenantItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  province: string;
  template: string;
  status: 'Published' | 'Draft' | 'Pending' | 'Suspended';
  createdAt: string;
  dbStatus: 'Connected' | 'Sync Needed';
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'templates' | 'logs'>('tenants');
  const [tenants, setTenants] = useState<TenantItem[]>([
    {
      id: 'T01',
      name: 'Làng Gốm Bát Tràng',
      slug: 'bat-trang',
      category: 'Gốm Sứ / Ceramics',
      province: 'Hà Nội',
      template: 'Bản Bát Tràng (Ceramics Starter)',
      status: 'Published',
      createdAt: '2026-05-20',
      dbStatus: 'Connected',
    },
    {
      id: 'T02',
      name: 'Làng Lụa Vạn Phúc',
      slug: 'van-phuc',
      category: 'Tơ Lụa / Silk Weaving',
      province: 'Hà Nội',
      template: 'Bản Vạn Phúc (Silk Editorial)',
      status: 'Published',
      createdAt: '2026-05-22',
      dbStatus: 'Connected',
    },
    {
      id: 'T03',
      name: 'Làng Tranh Đông Hồ',
      slug: 'dong-ho',
      category: 'Tranh Dân Gian / Folk Painting',
      province: 'Bắc Ninh',
      template: 'Bản Giấy Dó (Minimalist Paper)',
      status: 'Pending',
      createdAt: '2026-05-27',
      dbStatus: 'Connected',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Stats for the platform
  const stats = [
    { label: 'Tổng số làng nghề / Registered Villages', value: '12', icon: Users, color: 'text-lacquer bg-lacquer/10' },
    { label: 'Tên miền hoạt động / Active Domains', value: '8 / 12', icon: Globe, color: 'text-accent bg-accent/15' },
    { label: 'Doanh số toàn sàn / Global Sales', value: '185,240,000đ', icon: DollarSign, color: 'text-primary bg-primary/10' },
    { label: 'Lượt đặt toàn hệ thống / Total Bookings', value: '142', icon: Calendar, color: 'text-bronze bg-bronze/15' },
  ];

  const handleSyncDb = (id: string, name: string) => {
    setLoadingAction(id);
    setTimeout(() => {
      setLoadingAction(null);
      alert(`Đã đồng bộ hóa cơ sở dữ liệu và cấu hình phân phối cho làng nghề ${name} thành công!`);
    }, 1500);
  };

  const handleToggleStatus = (id: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === id) {
          let newStatus: 'Published' | 'Draft' | 'Pending' | 'Suspended' = 'Published';
          if (t.status === 'Published') {
            newStatus = 'Draft';
            alert(`Đã hạ trạng thái hoạt động của làng nghề ${t.name} xuống bản nháp.`);
          } else {
            newStatus = 'Published';
            alert(`🎉 PHÊ DUYỆT THÀNH CÔNG!\n\nĐã duyệt và kích hoạt tên miền phụ https://${t.slug}.hoalang.vn cho ${t.name}.\nCơ sở dữ liệu biệt lập (tenant_${t.slug.replace('-', '_')}) đã được đồng bộ hóa hoạt động!`);
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 flex flex-col text-left select-none relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      <div className="max-w-[1200px] w-full mx-auto space-y-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="space-y-2">
          <SectionLabel label="Hệ thống quản trị toàn cầu / System Operations" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
                Trung Tâm Vận Hành HoaLang Portal
              </h2>
              <p className="font-sans text-xs text-ash font-light leading-relaxed">
                Giám sát tình trạng đồng bộ hóa cơ sở dữ liệu các làng nghề, quản trị tên miền phụ (subdomains) và cấp phát starter templates.
              </p>
            </div>
            
            <button
              onClick={() => {
                const name = prompt('Nhập tên làng nghề mới:');
                const slug = prompt('Nhập slug tên miền phụ (vd: dong-ho):');
                if (name && slug) {
                  setTenants(prev => [
                    ...prev,
                    {
                      id: `T0${prev.length + 1}`,
                      name,
                      slug,
                      category: 'Thủ công mỹ nghệ',
                      province: 'Việt Nam',
                      template: 'Bản Giấy Dó (Minimalist Paper)',
                      status: 'Draft',
                      createdAt: new Date().toISOString().split('T')[0],
                      dbStatus: 'Connected',
                    }
                  ]);
                }
              }}
              className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xs hover:brightness-110 shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>Cấp Phát Làng Nghề</span>
            </button>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-cream border border-stone rounded-sm p-6 flex items-center justify-between shadow-sm hover:shadow-hover transition-all duration-300"
            >
              <div className="space-y-1.5 text-left">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-ash block">
                  {stat.label}
                </span>
                <span className="font-heading text-2xl font-bold italic text-charcoal block">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3 rounded-xs shrink-0 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        <OrnamentDivider className="text-stone/40 py-2" />

        {/* Tab Controls Navigation */}
        <div className="flex border-b border-stone/50 gap-6">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'tenants'
                ? 'border-lacquer text-lacquer'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Quản Lý Làng Nghề ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'templates'
                ? 'border-lacquer text-lacquer'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Bản Thiết Kế Mẫu
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'logs'
                ? 'border-lacquer text-lacquer'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Nhật Ký Vận Hành
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            {/* Search filter bar */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Tìm kiếm làng nghề theo tên, slug, hoặc tỉnh thành..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-grow bg-cream border border-stone rounded-sm px-4 py-2.5 font-sans text-xs text-charcoal placeholder-ash/80 focus:border-bronze focus:outline-none"
              />
            </div>

            {/* List Table of Tenants */}
            <div className="bg-cream border border-stone rounded-sm overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full font-sans text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-stone/10 border-b border-stone/30 font-semibold uppercase tracking-wider text-ash text-[10px]">
                      <th className="px-6 py-4">Làng Nghề</th>
                      <th className="px-6 py-4">Tên Miền Mapped</th>
                      <th className="px-6 py-4">Starter Template</th>
                      <th className="px-6 py-4">Ngày Cấp</th>
                      <th className="px-6 py-4">Cơ Sở Dữ Liệu</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone/20">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-ash font-light italic">
                          Không tìm thấy làng nghề nào khớp với từ khóa tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map(t => (
                        <tr key={t.id} className="hover:bg-stone/5 transition-colors">
                          {/* Name & ID */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-heading text-[15px] font-semibold text-charcoal italic leading-tight">
                                {t.name}
                              </span>
                              <span className="text-[10px] text-ash font-light">
                                {t.category} • Tỉnh {t.province}
                              </span>
                            </div>
                          </td>

                          {/* Domain */}
                          <td className="px-6 py-4 font-mono font-medium text-bronze">
                            {t.slug}.hoalang.vn
                          </td>

                          {/* Template */}
                          <td className="px-6 py-4 text-ash font-medium">
                            {t.template}
                          </td>

                          {/* Creation Date */}
                          <td className="px-6 py-4 text-ash">
                            {t.createdAt}
                          </td>

                          {/* Database Status */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[9px] uppercase text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-xs">
                              <Database className="w-3 h-3 text-green-600" />
                              <span>{t.dbStatus}</span>
                            </span>
                          </td>

                          {/* Live/Draft Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 font-semibold text-[9px] uppercase px-2.5 py-0.5 border rounded-xs ${
                              t.status === 'Published'
                                ? 'border-accent/40 bg-accent/15 text-gold'
                                : t.status === 'Pending'
                                ? 'border-yellow-400/60 bg-yellow-50 text-amber-700 animate-pulse'
                                : 'border-stone/40 bg-stone/10 text-ash'
                            }`}>
                              {t.status === 'Pending' ? 'Chờ Duyệt' : t.status}
                            </span>
                          </td>

                          {/* Action triggers */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSyncDb(t.id, t.name)}
                                disabled={loadingAction !== null}
                                title="Đồng bộ lại database"
                                className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash hover:text-charcoal rounded-xs transition-all disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === t.id ? 'animate-spin text-lacquer' : ''}`} />
                              </button>
                              
                              {t.status === 'Pending' ? (
                                <button
                                  onClick={() => handleToggleStatus(t.id)}
                                  title="Phê duyệt làng nghề"
                                  className="px-3 py-1.5 bg-lacquer text-cream hover:brightness-110 rounded-xs transition-all flex items-center gap-1.5 font-sans font-semibold text-[9px] uppercase tracking-wider"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                                  <span>Phê Duyệt</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleStatus(t.id)}
                                  title={t.status === 'Published' ? 'Hạ xuống bản nháp' : 'Xuất bản trực tuyến'}
                                  className={`p-2 border rounded-xs transition-all ${
                                    t.status === 'Published'
                                      ? 'border-lacquer/30 hover:bg-lacquer/10 text-lacquer'
                                      : 'border-accent/30 hover:bg-accent/10 text-gold'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <a
                                href={`/vi/tenant/${t.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Xem trực tiếp"
                                className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash hover:text-charcoal rounded-xs transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Global Design Templates Configuration */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-lacquer font-sans block">
                Starter Template 01
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Gốm Sứ Bát Tràng (Ceramics)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light">
                Giao diện nghệ thuật chuyên sâu cho nghề gốm sứ. Hỗ trợ hiển thị các bộ sưu tập đất nung tráng men, tích hợp thẻ thông tin nghệ nhân và câu chuyện lịch sử lò nung.
              </p>
              <div className="pt-2 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash">
                <span>Active Villages: 4</span>
                <span className="text-gold uppercase tracking-wider">Premium Mode</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                Starter Template 02
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Tơ Lụa Hàng Kênh (Silk Weaving)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light">
                Thiết kế mang đậm phong cách tạp chí thời trang editorial. Tôn vinh các khung cửi dệt mộc, se tơ tằm nguyên chất và phân loại sợi chỉ màu sắc cao cấp.
              </p>
              <div className="pt-2 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash">
                <span>Active Villages: 3</span>
                <span className="text-gold uppercase tracking-wider">Premium Mode</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ash font-sans block">
                Starter Template 03
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Mộc Kim Bồng / Giấy Dó (Minimal Paper)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light">
                Giao diện tối giản mang màu sắc giấy dó hữu cơ và thớ gỗ mộc mạc. Tập trung vào các khoảng thở typography tinh tế và hình ảnh thực địa làng nghề trạm trổ gỗ nghệ thuật.
              </p>
              <div className="pt-2 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash">
                <span>Active Villages: 5</span>
                <span className="text-gold uppercase tracking-wider">Standard Mode</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Operations Server Logs */}
        {activeTab === 'logs' && (
          <div className="bg-cream border border-stone rounded-sm p-6 shadow-sm text-left space-y-4">
            <h4 className="font-heading text-xl italic font-semibold text-charcoal border-b border-stone/30 pb-2">
              Lịch sử giao dịch & Tác vụ hệ thống
            </h4>

            <div className="space-y-3 font-mono text-[11px] text-ash leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-lacquer font-semibold">[2026-05-27 20:24:52]</span>
                <span>SYSTEM: Database provisioning initialized successfully for tenant: <strong className="text-charcoal">dong-ho</strong>. Seed files copied.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lacquer font-semibold">[2026-05-27 20:20:10]</span>
                <span>AUTH: User <strong className="text-charcoal">artisan.dongho@gmail.com</strong> role upgraded to <strong className="text-gold">VILLAGE_OWNER</strong>.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lacquer font-semibold">[2026-05-22 14:15:33]</span>
                <span>SYSTEM: Tenant database sync complete for <strong className="text-charcoal">van-phuc</strong>. Custom subdomains successfully bound.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lacquer font-semibold">[2026-05-20 09:30:12]</span>
                <span>ROUTING: Platform custom proxy rules synchronized. Wildcard *.hoalang.vn mappings active.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
