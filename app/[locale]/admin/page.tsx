'use client';

import React, { useState } from 'react';
import {
  Users,
  Database,
  Globe,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Power,
  Coins,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import { getTenantUrl } from '@/lib/tenant-url';
import { toast } from 'sonner';

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  province: string;
  template: string;
  status: 'Published' | 'Draft' | 'Suspended';
  createdAt: string;
  dbStatus: 'Connected' | 'Sync Needed';
}

interface PendingRegistration {
  id: string;
  name: string;
  slug: string;
  artisanName: string;
  phone: string;
  category: string;
  province: string;
  description: string;
  appliedAt: string;
  template: string;
}

interface SystemTransaction {
  id: string;
  tenantName: string;
  amount: number;
  commission: number;
  date: string;
  status: 'Collected' | 'Pending';
}

interface OperationalLog {
  timestamp: string;
  type: 'SYSTEM' | 'AUTH' | 'ROUTING' | 'FINANCE';
  message: string;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'revenue' | 'templates' | 'logs'>('tenants');
  const [commissionRate, setCommissionRate] = useState<number>(5.0); // Global fee rate 5.0%

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
      status: 'Published',
      createdAt: '2026-05-27',
      dbStatus: 'Connected',
    },
  ]);

  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([
    {
      id: 'R01',
      name: 'Làng Gốm Bàu Trúc',
      slug: 'bau-truc',
      artisanName: 'Nghệ nhân Đàng Thị Phan',
      phone: '0912.345.678',
      category: 'Gốm Đất Nung Mộc / Terracotta',
      province: 'Ninh Thuận',
      description: 'Kỹ nghệ làm gốm bằng tay không dùng bàn xoay, nung lộ thiên độc bản của người Chăm.',
      appliedAt: '2026-05-29',
      template: 'Bản Giấy Dó (Minimalist Paper)',
    },
    {
      id: 'R02',
      name: 'Làng Lụa Nha Xá',
      slug: 'nha-xa',
      artisanName: 'Nghệ nhân Nguyễn Văn Nam',
      phone: '0983.888.999',
      category: 'Dệt Lụa Tơ Tằm / Silk Weaving',
      province: 'Hà Hà Nam',
      description: 'Dòng lụa bóng mịn óng ả đệ nhị danh lụa xứ Bắc chỉ sau Vạn Phúc.',
      appliedAt: '2026-05-30',
      template: 'Bản Vạn Phúc (Silk Editorial)',
    },
  ]);

  const [transactions, setTransactions] = useState<SystemTransaction[]>([
    { id: 'TXN-9821', tenantName: 'Làng Gốm Bát Tràng', amount: 1850000, commission: 92500, date: '2026-05-30 14:22', status: 'Collected' },
    { id: 'TXN-9782', tenantName: 'Làng Lụa Vạn Phúc', amount: 1900000, commission: 95000, date: '2026-05-29 09:15', status: 'Collected' },
    { id: 'TXN-9654', tenantName: 'Làng Tranh Đông Hồ', amount: 640000, commission: 32000, date: '2026-05-28 17:45', status: 'Collected' },
    { id: 'TXN-9531', tenantName: 'Làng Gốm Bát Tràng', amount: 3200000, commission: 160000, date: '2026-05-27 11:30', status: 'Collected' },
    { id: 'TXN-9412', tenantName: 'Làng Lụa Vạn Phúc', amount: 1250000, commission: 62500, date: '2026-05-26 15:10', status: 'Collected' },
  ]);

  const [logs, setLogs] = useState<OperationalLog[]>([
    { timestamp: '2026-05-30 14:22:10', type: 'FINANCE', message: 'Giao dịch TXN-9821 thành công. Trích thu phí hệ thống 5% (92.500đ) từ Làng Gốm Bát Tràng.' },
    { timestamp: '2026-05-29 09:15:45', type: 'FINANCE', message: 'Giao dịch TXN-9782 thành công. Trích thu phí hệ thống 5% (95.000đ) từ Làng Lụa Vạn Phúc.' },
    { timestamp: '2026-05-28 17:45:02', type: 'FINANCE', message: 'Giao dịch TXN-9654 thành công. Trích thu phí hệ thống 5% (32.000đ) từ Làng Tranh Đông Hồ.' },
    { timestamp: '2026-05-27 20:24:52', type: 'SYSTEM', message: 'Cơ sở dữ liệu (tenant_dong_ho) đã được phân vùng và liên kết dữ liệu thành công.' },
    { timestamp: '2026-05-27 20:20:10', type: 'AUTH', message: 'Nâng cấp quyền hạn cho tài khoản nghệ nhân đại diện dongho.owner@hoalang.site thành VILLAGE_OWNER.' },
    { timestamp: '2026-05-22 14:15:33', type: 'SYSTEM', message: 'Đồng bộ hóa tên miền phụ hoàn tất cho van-phuc. Mapped: vanphuc.hoalang.site.' },
    { timestamp: '2026-05-20 09:30:12', type: 'ROUTING', message: 'Khởi tạo cấu trúc phân phối tên miền động thành công. Mapped: *.hoalang.site.' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Financial aggregation
  const totalGMV = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.commission, 0);

  // Stats cards rendering dynamically
  const stats = [
    { label: 'Tổng số làng nghề / Registered', value: `${tenants.length + pendingRegistrations.length}`, icon: Users, color: 'text-lacquer bg-lacquer/10' },
    { label: 'Cửa hàng hoạt động / Active Shops', value: `${tenants.filter(t => t.status === 'Published').length}`, icon: Globe, color: 'text-accent bg-accent/15' },
    { label: 'Doanh số toàn sàn / GMV', value: `${totalGMV.toLocaleString('vi-VN')}đ`, icon: TrendingUp, color: 'text-primary bg-primary/10' },
    { label: 'Phí hệ thống (Thu 5%) / Revenue', value: `${totalCommission.toLocaleString('vi-VN')}đ`, icon: Coins, color: 'text-gold bg-gold/15' },
  ];

  const handleSyncDb = (id: string, name: string) => {
    setLoadingAction(id);
    setTimeout(() => {
      setLoadingAction(null);
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setLogs(prev => [
        { timestamp: nowStr, type: 'SYSTEM', message: `FORCE SYNC: Bắt buộc đồng bộ cơ sở dữ liệu và cấu hình tên miền phụ hoàn tất cho làng nghề: ${name}.` },
        ...prev
      ]);
      toast.success(`Đồng bộ dữ liệu ${name} thành công!`, {
        description: 'Tên miền phụ và tài nguyên MongoDB biệt lập đã được đồng bộ hóa.'
      });
    }, 1200);
  };

  const handleToggleStatus = (id: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newStatus = t.status === 'Published' ? 'Draft' : 'Published';
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
          setLogs(prevLogs => [
            { timestamp: nowStr, type: 'ROUTING', message: `Thay đổi trạng thái tên miền phụ ${t.slug}.hoalang.site sang: ${newStatus === 'Published' ? 'ACTIVE' : 'INACTIVE'}.` },
            ...prevLogs
          ]);
          toast.info(`Đã chuyển trạng thái ${t.name}`, {
            description: `Website hiện được chuyển sang dạng: ${newStatus === 'Published' ? 'Công khai (Live)' : 'Bản nháp (Draft)'}.`
          });
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Approval flow implementation
  const handleApprove = (reg: PendingRegistration) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // 1. Add to active tenants list
    const newTenant: TenantItem = {
      id: `T${String(tenants.length + 1).padStart(2, '0')}`,
      name: reg.name,
      slug: reg.slug,
      category: reg.category,
      province: reg.province,
      template: reg.template,
      status: 'Published',
      createdAt: new Date().toISOString().split('T')[0],
      dbStatus: 'Connected',
    };

    setTenants(prev => [...prev, newTenant]);

    // 2. Remove from pending registrations
    setPendingRegistrations(prev => prev.filter(r => r.id !== reg.id));

    // 3. Log actions to Operational Logs
    setLogs(prev => [
      { timestamp: nowStr, type: 'SYSTEM', message: `🎉 PHÊ DUYỆT THÀNH CÔNG: Đã duyệt đơn đăng ký của ${reg.name}.` },
      { timestamp: nowStr, type: 'SYSTEM', message: `DATABASE PROVISIONING: Khởi tạo database biệt lập (tenant_${reg.slug.replace(/-/g, '_')}) hoàn tất cho ${reg.name}.` },
      { timestamp: nowStr, type: 'ROUTING', message: `DOMAINS: Đã phân phối tên miền phụ chính thức https://${reg.slug.replace(/-/g, '')}.hoalang.site thành công.` },
      { timestamp: nowStr, type: 'AUTH', message: `AUTH: Phân quyền tài khoản nghệ nhân đại diện (${reg.artisanName}) thành VILLAGE_OWNER.` },
      ...prev
    ]);

    toast.success('Phê duyệt đối tác thành công!', {
      description: `Website ${reg.name} đã được cấp phát tên miền phụ hoạt động ngay lập tức.`
    });
  };

  const handleReject = (reg: PendingRegistration) => {
    setPendingRegistrations(prev => prev.filter(r => r.id !== reg.id));
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLogs(prev => [
      { timestamp: nowStr, type: 'AUTH', message: `TỪ CHỐI ĐĂNG KÝ: Từ chối đơn xin đăng ký làm tenant của ${reg.name} do thông tin kiểm định chưa chính xác.` },
      ...prev
    ]);
    toast.error(`Đã từ chối đơn đăng ký`, {
      description: `Đơn của ${reg.name} đã được trả về trạng thái từ chối.`
    });
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
          <SectionLabel label="Hệ thống vận hành tổng thể / Platform Operations" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
                Hệ Thống Quản Trị Super Admin Portal
              </h2>
              <p className="font-sans text-xs text-ash font-light leading-relaxed">
                Giám sát việc đăng ký đối tác (Multi-Tenant Applications), cấp phát phân vùng database biệt lập, phê duyệt website làng nghề và kiểm soát doanh thu trích phí giao dịch.
              </p>
            </div>
            
            <button
              onClick={() => {
                const name = prompt('Nhập tên làng nghề đăng ký mới:');
                const slug = prompt('Nhập slug tên miền phụ (vd: dong-ho):');
                if (name && slug) {
                  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
                  setPendingRegistrations(prev => [
                    ...prev,
                    {
                      id: `R0${prev.length + 1}`,
                      name,
                      slug,
                      artisanName: 'Nghệ nhân Đăng Ký Trực Tuyến',
                      phone: 'Chưa cập nhật',
                      category: 'Thủ công mỹ nghệ / Handicrafts',
                      province: 'Việt Nam',
                      description: 'Gian hàng trực tuyến đăng ký tự động từ cổng HoaLang Onboarding.',
                      appliedAt: new Date().toISOString().split('T')[0],
                      template: 'Bản Giấy Dó (Minimalist Paper)',
                    }
                  ]);
                  setLogs(prev => [
                    { timestamp: nowStr, type: 'SYSTEM', message: `APPLICATION RECEIVED: Nhận hồ sơ đăng ký đối tác mới từ ${name} (slug: ${slug}).` },
                    ...prev
                  ]);
                  toast.success('Hồ sơ đăng ký đã được xếp hàng chờ phê duyệt!');
                }
              }}
              className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-sm hover:brightness-110 shadow-sm transition-all shrink-0 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>Nhận Đăng Ký Làng Nghề</span>
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
        <div className="flex border-b border-stone/50 gap-6 overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'tenants'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Quản Lý Đối Tác ({tenants.length + pendingRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'revenue'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Doanh Thu Hệ Thống ({totalCommission.toLocaleString('vi-VN')}đ)
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'templates'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Bản Thiết Kế Mẫu
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'logs'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            Nhật Ký Vận Hành
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'tenants' && (
          <div className="space-y-8 text-left">
            
            {/* ═══════════════════════════════════════════
                PHẦN 1 — HỒ SƠ ĐĂNG KÝ CHỜ PHÊ DUYỆT (Approve flow)
                ════════════════════════════════════════════ */}
            <div className="space-y-4">
              <div className="border-l-2 border-gold pl-3">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-gold font-sans block">
                  Cổng Xét Duyệt / Applications Desk
                </span>
                <h3 className="font-heading text-xl font-bold italic text-charcoal">
                  Đơn Đăng Ký Chờ Phê Duyệt ({pendingRegistrations.length})
                </h3>
              </div>

              {pendingRegistrations.length === 0 ? (
                <div className="bg-cream/40 border border-stone/50 border-dashed rounded-sm p-8 text-center text-ash font-light italic">
                  Hiện không có hồ sơ đăng ký mới nào đang chờ xét duyệt.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Decorative tag */}
                      <span className="absolute top-0 right-0 bg-gold/10 text-gold text-[8px] font-bold uppercase tracking-wider px-3 py-1 border-b border-l border-stone/40">
                        Chờ Kiểm Duyệt
                      </span>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-ash font-sans block">
                          {reg.province} • Nộp ngày: {reg.appliedAt}
                        </span>
                        <h4 className="font-heading text-lg font-bold italic text-charcoal leading-snug">
                          {reg.name}
                        </h4>
                        <p className="text-[11px] text-ash font-sans font-semibold">
                          Nghệ nhân đại diện: {reg.artisanName} ({reg.phone})
                        </p>
                      </div>

                      <p className="text-xs text-ash leading-relaxed font-light font-sans border-t border-b border-stone/30 py-3">
                        {reg.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-medium text-ash">
                        <span>Starter Template: <strong className="text-charcoal font-sans">{reg.template.split(' ')[1] || 'Minimal'}</strong></span>
                        <span className="font-mono text-bronze uppercase font-semibold">{reg.slug}.hoalang.site</span>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => handleApprove(reg)}
                          className="flex-grow inline-flex items-center justify-center gap-1.5 bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider py-3 rounded-xs hover:brightness-110 transition-all active:scale-[0.98]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                          <span>Phê Duyệt & Khởi Tạo Subdomain</span>
                        </button>
                        <button
                          onClick={() => handleReject(reg)}
                          className="px-4 py-3 border border-stone hover:border-primary text-ash hover:text-primary font-sans text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98]"
                        >
                          Từ Chối
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════
                PHẦN 2 — DANH SÁCH LÀNG NGHỀ ĐANG HOẠT ĐỘNG
                ════════════════════════════════════════════ */}
            <div className="space-y-4 pt-4 border-t border-stone/30">
              <div className="border-l-2 border-primary pl-3">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-ash font-sans block">
                  Danh bạ di sản / Registered Directories
                </span>
                <h3 className="font-heading text-xl font-bold italic text-charcoal">
                  Mạng Lưới Làng Nghề Đang Hoạt Động ({tenants.length})
                </h3>
              </div>

              {/* Search filter bar */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm làng nghề theo tên, slug, hoặc tỉnh thành..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-grow bg-cream border border-stone rounded-sm px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/80 focus:border-bronze focus:outline-none"
                />
              </div>

              {/* List Table of Tenants */}
              <div className="bg-cream border border-stone rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full font-sans text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-stone/10 border-b border-stone/30 font-semibold uppercase tracking-wider text-ash text-[9px]">
                        <th className="px-6 py-4">Làng Nghề</th>
                        <th className="px-6 py-4">Tên Miền Mapped (Subdomain)</th>
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
                                <span className="text-[10px] text-ash font-light mt-0.5">
                                  {t.category} • Tỉnh {t.province}
                                </span>
                              </div>
                            </td>

                            {/* Domain */}
                            <td className="px-6 py-4 font-mono font-medium text-bronze">
                              {t.slug.replace(/-/g, '')}.hoalang.site
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
                              <span className="inline-flex items-center gap-1.5 font-semibold text-[8px] uppercase text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-xs">
                                <Database className="w-2.5 h-2.5 text-green-600" />
                                <span>{t.dbStatus}</span>
                              </span>
                            </td>

                            {/* Live/Draft Status */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 border rounded-xs text-[9px] font-semibold uppercase tracking-wider ${
                                t.status === 'Published'
                                  ? 'border-accent/40 bg-accent/15 text-gold'
                                  : 'border-stone bg-transparent text-ash'
                              }`}>
                                {t.status === 'Published' ? 'LIVE' : 'DRAFT'}
                              </span>
                            </td>

                            {/* Action triggers */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleSyncDb(t.id, t.name)}
                                  disabled={loadingAction !== null}
                                  title="Đồng bộ cơ sở dữ liệu biệt lập"
                                  className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash hover:text-charcoal rounded-xs transition-all disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === t.id ? 'animate-spin text-lacquer' : ''}`} />
                                </button>
                                
                                <button
                                  onClick={() => handleToggleStatus(t.id)}
                                  title={t.status === 'Published' ? 'Hạ xuống Bản Nháp' : 'Xuất bản công khai'}
                                  className={`p-2 border rounded-xs transition-all ${
                                    t.status === 'Published'
                                      ? 'border-lacquer/30 hover:bg-lacquer/10 text-lacquer'
                                      : 'border-accent/30 hover:bg-accent/10 text-gold'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>

                                <a
                                  href={getTenantUrl(t.slug, 'vi')}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Xem trực tiếp trang web của Tenant"
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

          </div>
        )}

        {/* ═══════════════════════════════════════════
            TAB 2 — DOANH THU HỆ THỐNG (Platform Revenue from fees)
            ════════════════════════════════════════════ */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Commission Configuration & Analysis */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Configuration panel */}
                <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
                  <div className="border-b border-stone/30 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-gold font-sans block">
                        Cấu hình thanh toán / Rates
                      </span>
                      <h4 className="font-heading text-lg italic font-bold text-charcoal">
                        Tỷ Lệ Phí Giao Dịch
                      </h4>
                    </div>
                    <Coins className="w-5 h-5 text-gold" />
                  </div>

                  <div className="space-y-4 font-sans text-xs">
                    <p className="font-sans text-[11px] font-light text-ash leading-relaxed">
                      Hệ thống tự động trích hoa hồng trực tiếp từ các đơn hàng giao dịch thành công (Mỹ nghệ & Workshop) qua hệ thống cổng thanh toán liên kết của các chi nhánh.
                    </p>

                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-charcoal">Tỷ lệ chiết khấu toàn hệ thống:</span>
                        <span className="text-lacquer font-bold font-mono text-sm">{commissionRate.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="0.5"
                        value={commissionRate}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value);
                          setCommissionRate(newRate);
                          
                          // Dynamically recalculate commissions in the transactions list
                          setTransactions(prev => prev.map(item => ({
                            ...item,
                            commission: Math.round(item.amount * (newRate / 100))
                          })));
                          
                          toast.success(`Cập nhật tỷ lệ phí hệ thống thành ${newRate.toFixed(1)}%!`, {
                            description: 'Doanh số trích thu phí đã được điều chỉnh tự động.'
                          });
                        }}
                        className="w-full accent-lacquer cursor-pointer"
                      />
                    </div>

                    <div className="bg-parchment/60 border border-stone/50 p-4 rounded-xs text-[11px] leading-relaxed text-ash font-light">
                      <span className="text-lacquer font-semibold block mb-0.5">💡 Quy tắc khấu trừ tự động:</span>
                      Phí hệ thống thu về sẽ được hạch toán trực tiếp khi ngân hàng đối tác hoàn thành xử lý thanh toán đơn hàng. Tiền được cộng dồn vào quỹ chung của hệ thống HoaLang.
                    </div>
                  </div>
                </div>

                {/* Revenue Share breakdown Chart via Pure CSS and Tailwind */}
                <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-gold font-sans block">
                      Đóng góp doanh số / Market Share
                    </span>
                    <h4 className="font-heading text-lg italic font-bold text-charcoal border-b border-stone/30 pb-2">
                      Đóng Góp Doanh Thu Chi Nhánh
                    </h4>
                  </div>

                  <div className="space-y-4 pt-1 font-sans text-xs">
                    {/* Bat Trang */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">Làng Gốm Bát Tràng</span>
                        <span className="font-mono font-semibold">58%</span>
                      </div>
                      <div className="w-full bg-stone/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-lacquer h-full" style={{ width: '58%' }} />
                      </div>
                    </div>

                    {/* Van Phuc */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">Làng Lụa Vạn Phúc</span>
                        <span className="font-mono font-semibold">35%</span>
                      </div>
                      <div className="w-full bg-stone/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full" style={{ width: '35%' }} />
                      </div>
                    </div>

                    {/* Dong Ho */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">Làng Tranh Đông Hồ</span>
                        <span className="font-mono font-semibold">7%</span>
                      </div>
                      <div className="w-full bg-stone/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-bronze h-full" style={{ width: '7%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Transaction Log Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-cream border border-stone rounded-sm p-6 shadow-sm flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="border-b border-stone/30 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-ash font-sans block">
                          Sổ cái giao dịch / Ledger
                        </span>
                        <h3 className="font-heading text-xl font-bold italic text-charcoal">
                          Sổ Nhật Ký Trích Thu Phí Hệ Thống
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-xs shadow-xs">
                        Tổng phí thu về: {totalCommission.toLocaleString('vi-VN')} VND
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full font-sans text-xs border-collapse text-left">
                        <thead>
                          <tr className="border-b border-stone/30 font-semibold uppercase tracking-wider text-ash text-[9px] bg-stone/5">
                            <th className="p-3">Mã Đơn / TXN ID</th>
                            <th className="p-3">Làng Nghề Giao Giao Dịch</th>
                            <th className="p-3">Trị Giá Đơn</th>
                            <th className="p-3">Phí Trích ({commissionRate}%)</th>
                            <th className="p-3">Ngày Giao Dịch</th>
                            <th className="p-3 text-center">Tình Trạng</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone/20 font-light text-ash">
                          {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-stone/5 transition-colors">
                              <td className="p-3 font-semibold text-charcoal">{txn.id}</td>
                              <td className="p-3 font-medium text-charcoal">{txn.tenantName}</td>
                              <td className="p-3 text-charcoal font-medium">
                                {txn.amount.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="p-3 font-semibold text-lacquer">
                                {txn.commission.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="p-3 font-mono text-[10px]">{txn.date}</td>
                              <td className="p-3 text-center">
                                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                                  <CheckCircle className="w-2.5 h-2.5" />
                                  <span>Đã Thu</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone/30 text-xs font-sans font-light text-ash text-center italic">
                    Dữ liệu cập nhật thời gian thực từ mạng lưới thanh toán HoaLang Multi-Tenant Core Engine.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Global Design Templates Configuration */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-lacquer font-sans block">
                Starter Template 01
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Gốm Sứ Bát Tràng (Ceramics)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                Giao diện nghệ thuật chuyên sâu cho nghề gốm sứ. Hỗ trợ hiển thị các bộ sưu tập đất nung tráng men, tích hợp thẻ thông tin nghệ nhân và câu chuyện lịch sử lò nung.
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>Active Villages: 4</span>
                <span className="text-gold uppercase tracking-wider font-semibold">Premium Mode</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                Starter Template 02
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Tơ Lụa Hàng Kênh (Silk Weaving)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                Thiết kế mang đậm phong cách tạp chí thời trang editorial. Tôn vinh các khung cửi dệt mộc, se tơ tằm nguyên chất và phân loại sợi chỉ màu sắc cao cấp.
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>Active Villages: 3</span>
                <span className="text-gold uppercase tracking-wider font-semibold">Premium Mode</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ash font-sans block">
                Starter Template 03
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                Mộc Kim Bồng / Giấy Dó (Minimal Paper)
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                Giao diện tối giản mang màu sắc giấy dó hữu cơ và thớ gỗ mộc mạc. Tập trung vào các khoảng thở typography tinh tế và hình ảnh thực địa làng nghề trạm trổ gỗ nghệ thuật.
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>Active Villages: 5</span>
                <span className="text-gold uppercase tracking-wider font-semibold font-medium">Standard Mode</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Operations Server Logs */}
        {activeTab === 'logs' && (
          <div className="bg-cream border border-stone rounded-sm p-6 shadow-sm text-left space-y-4">
            <div className="border-b border-stone/30 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-ash font-sans block">
                  Ghi chú hệ thống / Server Auditing
                </span>
                <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                  Nhật Ký Tác Vụ & Sự Kiện Hoạt Động
                </h4>
              </div>
              
              <button
                onClick={() => {
                  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
                  setLogs(prev => [
                    { timestamp: nowStr, type: 'SYSTEM', message: 'AUDIT REFRESH: Cưỡng chế làm mới trạng thái lưu trữ đám mây và đồng bộ phiên hoạt động.' },
                    ...prev
                  ]);
                  toast.success('Nhật ký vận hành đã được cập nhật mới nhất!');
                }}
                className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash rounded-xs transition-all active:scale-[0.97]"
                title="Làm mới nhật ký"
              >
                <RefreshCw className="w-3.5 h-3.5 text-accent" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-ash leading-relaxed max-h-[400px] overflow-y-auto pr-2">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-stone/10 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-lacquer font-semibold shrink-0">[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-semibold uppercase tracking-wider shrink-0 select-none ${
                    log.type === 'FINANCE'
                      ? 'border border-green-200 bg-green-50 text-green-800'
                      : log.type === 'SYSTEM'
                      ? 'border border-blue-200 bg-blue-50 text-blue-800'
                      : log.type === 'ROUTING'
                      ? 'border border-yellow-200 bg-yellow-50 text-amber-800'
                      : 'border border-stone bg-transparent text-ash'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-charcoal font-sans font-light">
                    {log.message.includes('https://') || log.message.includes('tenant_') ? (
                      // Highlight code values
                      log.message.split(' ').map((word, idx) => {
                        if (word.startsWith('https://') || word.includes('tenant_')) {
                          return <strong key={idx} className="text-bronze font-mono font-bold mx-0.5">{word}</strong>;
                        }
                        return word + ' ';
                      })
                    ) : (
                      log.message
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
