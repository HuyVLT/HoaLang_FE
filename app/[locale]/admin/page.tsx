'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import api from '@/lib/api';
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
  CheckCircle,
  X,
  Compass,
  LogOut,
  MessageSquareWarning
} from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import { getTenantUrl } from '@/lib/tenant-url';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  province: string;
  templateId: string;
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
  templateId: string;
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
  const router = useRouter();
  const t = useTranslations('adminDashboard');
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    fullName: string;
    password?: string;
    tenantName: string;
    subdomain: string;
  } | null>(null);

  // Rejection reason modal state
  const [rejectingRequest, setRejectingRequest] = useState<PendingRegistration | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || !user) {
        toast.error(t('authRequired'));
        router.replace('/auth/login');
      } else if (user.role !== 'admin') {
        toast.error(t('authForbidden'));
        router.replace('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [mounted, isAuthenticated, user, router, t]);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/tenant/requests');
      if (res.data && res.data.success) {
        const mapped = res.data.data.map((r: { _id: string; name: string; slug: string; artisanName?: string; phone?: string; category?: string; province?: string; description?: string; createdAt: string; templateId?: string; status: string; }) => ({
          id: r._id,
          name: r.name,
          slug: r.slug,
          artisanName: r.artisanName || 'Nghệ nhân',
          phone: r.phone || 'Chưa cập nhật',
          category: r.category || 'Mỹ nghệ',
          province: r.province || 'Việt Nam',
          description: r.description || '',
          appliedAt: new Date(r.createdAt).toISOString().split('T')[0],
          templateId: r.templateId || 'paper-template',
          status: r.status,
        }));
        setPendingRegistrations(mapped.filter((x: { status: string }) => x.status === 'PENDING'));
      }
    } catch (err) {
      console.error('[AdminPage] Error fetching requests:', err);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenant');
      if (res.data && res.data.success) {
        const mapped = res.data.data.map((t: { _id: string; name: string; slug: string; category?: string; province?: string; templateId?: string; status: string; createdAt: string; }) => ({
          id: t._id,
          name: t.name,
          slug: t.slug,
          category: t.category || 'Mỹ nghệ',
          province: t.province || 'Việt Nam',
          templateId: t.templateId || 'paper-template',
          status: t.status === 'ACTIVE' ? 'Published' : 'Suspended',
          createdAt: new Date(t.createdAt).toISOString().split('T')[0],
          dbStatus: 'Connected' as const,
        }));
        setTenants(mapped);
      }
    } catch (err) {
      console.error('[AdminPage] Error fetching tenants:', err);
    }
  };

  const [transactions, setTransactions] = useState<SystemTransaction[]>([]);
  const [logs, setLogs] = useState<OperationalLog[]>([]);

  const fetchAdminDashboardData = async () => {
    try {
      const res = await api.get('/tenant/admin-dashboard-data');
      if (res.data && res.data.success) {
        setTransactions(res.data.data.transactions);
        setLogs(res.data.data.logs);
      }
    } catch (err) {
      console.error('[AdminPage] Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchRequests();
      fetchTenants();
      fetchAdminDashboardData();
    }
  }, [isAuthorized]);

  const [activeTab, setActiveTab] = useState<'tenants' | 'revenue' | 'templates' | 'logs'>('tenants');
  const [commissionRate, setCommissionRate] = useState<number>(5.0); // Global fee rate 5.0%

  // Overlay form states for premium registration modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newVillageName, setNewVillageName] = useState('');
  const [newVillageSlug, setNewVillageSlug] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newArtisanName, setNewArtisanName] = useState('Nghệ nhân Đăng Ký Trực Tuyến');
  const [newPhone, setNewPhone] = useState('Chưa cập nhật');
  const [newProvince, setNewProvince] = useState('Việt Nam');
  const [newDescription, setNewDescription] = useState('Gian hàng trực tuyến đăng ký tự động từ cổng HoaLang Onboarding.');
  const [newTemplate, setNewTemplate] = useState('paper-template');

  const handleSubmitNewVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName || !newVillageSlug || !newEmail) {
      toast.error(t('validationError'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error(t('validationEmailError'));
      return;
    }

    const templateId = newTemplate;

    try {
      const res = await api.post('/tenant/onboarding', {
        name: newVillageName,
        slug: newVillageSlug,
        email: newEmail,
        artisanName: newArtisanName,
        phone: newPhone,
        category: 'Thủ công mỹ nghệ / Handicrafts',
        province: newProvince,
        description: newDescription,
        templateId,
      });

      if (res.data && res.data.success) {
        toast.success(t('toastOnboardingSent'), {
          description: t('toastOnboardingSentDesc'),
        });
        setModalOpen(false);
        // Refresh requests and logs
        fetchRequests();
        fetchAdminDashboardData();
      }
    } catch (err) {
      console.error('[AdminPage] Error creating onboarding:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra khi tạo hồ sơ đăng ký.');
    }
  };

  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!mounted || !isAuthorized) {
    return (
      <div className="h-screen w-screen bg-parchment flex flex-col items-center justify-center select-none relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Compass className="w-12 h-12 text-lacquer animate-spin duration-3000" />
          <span className="font-heading italic text-lg text-charcoal font-semibold">{t('authenticating')}</span>
        </div>
      </div>
    );
  }

  // Financial aggregation
  const totalGMV = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.commission, 0);

  // Stats cards rendering dynamically
  const stats = [
    { label: t('totalVillages'), value: `${tenants.length + pendingRegistrations.length}`, icon: Users, color: 'text-lacquer bg-lacquer/10' },
    { label: t('activeShops'), value: `${tenants.filter(t => t.status === 'Published').length}`, icon: Globe, color: 'text-accent bg-accent/15' },
    { label: t('gmv'), value: `${totalGMV.toLocaleString('vi-VN')}đ`, icon: TrendingUp, color: 'text-primary bg-primary/10' },
    { label: t('platformRevenue', { rate: commissionRate.toFixed(0) }), value: `${totalCommission.toLocaleString('vi-VN')}đ`, icon: Coins, color: 'text-gold bg-gold/15' },
  ];

  const handleSyncDb = (id: string, name: string) => {
    setLoadingAction(id);
    setTimeout(() => {
      setLoadingAction(null);
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setLogs(prev => [
        { timestamp: nowStr, type: 'SYSTEM', message: t('logForceSync', { name }) },
        ...prev
      ]);
      toast.success(t('toastSyncSuccess', { name }), {
        description: t('toastSyncDesc')
      });
    }, 1200);
  };

  const handleToggleStatus = (id: string) => {
    setTenants(prev =>
      prev.map(tItem => {
        if (tItem.id === id) {
          const newStatus = tItem.status === 'Published' ? 'Draft' : 'Published';
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
          setLogs(prevLogs => [
            { timestamp: nowStr, type: 'ROUTING', message: t('logToggleStatus', { slug: tItem.slug, status: newStatus === 'Published' ? 'ACTIVE' : 'INACTIVE' }) },
            ...prevLogs
          ]);
          toast.info(t('toastToggleStatus', { name: tItem.name }), {
            description: t('toastToggleStatusDesc', { status: newStatus === 'Published' ? t('statusLive') : t('statusDraft') })
          });
          return { ...tItem, status: newStatus };
        }
        return tItem;
      })
    );
  };

  // Approval flow implementation
  const handleApprove = async (reg: PendingRegistration) => {
    setLoadingAction(reg.id);
    try {
      const res = await api.post(`/tenant/requests/${reg.id}/approve`);
      if (res.data && res.data.success) {
        const { ownerUser } = res.data.data;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // Log actions to Operational Logs
        setLogs(prev => [
          { timestamp: nowStr, type: 'SYSTEM', message: t('logOnboardingSuccess', { name: reg.name }) },
          { timestamp: nowStr, type: 'SYSTEM', message: t('logDbProvisioning', { slug: reg.slug.replace(/-/g, '_'), name: reg.name }) },
          { timestamp: nowStr, type: 'ROUTING', message: t('logDomainConfig', { slug: reg.slug }) },
          { timestamp: nowStr, type: 'AUTH', message: t('logAuthAdmin', { email: ownerUser.email }) },
          ...prev
        ]);

        toast.success(t('toastApproveSuccess'), {
          description: t('toastApproveDesc', { name: reg.name })
        });

        // Show credentials popup
        setGeneratedCredentials({
          email: ownerUser.email,
          fullName: ownerUser.fullName,
          password: ownerUser.password,
          tenantName: reg.name,
          subdomain: `${reg.slug}.hoalang.site`,
        });
        setCredentialsModalOpen(true);

        // Refresh requests, tenants and transactions
        fetchRequests();
        fetchTenants();
        fetchAdminDashboardData();
      }
    } catch (err) {
      console.error('[AdminPage] Error approving request:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt đăng ký.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = (reg: PendingRegistration) => {
    setRejectingRequest(reg);
    setRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    if (!rejectReason.trim()) {
      toast.error(t('rejectReasonRequired'));
      return;
    }

    setLoadingAction(rejectingRequest.id);
    try {
      const res = await api.post(`/tenant/requests/${rejectingRequest.id}/reject`, {
        reason: rejectReason.trim()
      });
      if (res.data && res.data.success) {
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setLogs(prev => [
          { timestamp: nowStr, type: 'AUTH', message: t('logRegistrationRejected', { name: rejectingRequest.name }) },
          ...prev
        ]);
        toast.info(t('toastRejectSuccess'), {
          description: t('toastRejectDesc', { name: rejectingRequest.name })
        });
        setRejectingRequest(null);
        setRejectReason('');
        fetchRequests();
      }
    } catch (err) {
      console.error('[AdminPage] Error rejecting request:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra khi từ chối đăng ký.');
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden text-ink select-none font-sans relative">
      {/* Organic background grain layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-0" />

      {/* ── SUPER ADMIN DESKTOP SIDEBAR ── */}
      <aside className="w-[280px] border-r border-stone bg-cream flex flex-col justify-between hidden md:flex shrink-0 relative z-10">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="px-6 py-6 border-b border-stone/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-lacquer flex items-center justify-center shadow-sm shrink-0">
              <Compass className="w-5 h-5 text-accent animate-spin duration-3000" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-semibold text-lg italic text-charcoal leading-snug">
                HoaLang Admin
              </h3>
              <span className="text-[9px] text-lacquer font-bold uppercase tracking-widest block">
                {t('rootLevel')}
              </span>
            </div>
          </div>

          {/* Super Admin Info */}
          <div className="px-6 py-4 bg-stone/10 border-b border-stone/20 flex flex-col gap-1 text-left">
            <span className="text-[10px] text-ash font-medium uppercase tracking-wider">
              {t('sidebarCategory')}
            </span>
            <span className="text-xs font-semibold text-charcoal truncate">
              {user?.name || user?.email || 'Super Admin'}
            </span>
            <span className="text-[9px] text-gold font-semibold uppercase tracking-widest">
              {t('rootLevel')}
            </span>
          </div>

          {/* Sidebar Navigation */}
          <div className="p-4 space-y-1.5 flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans px-3 mb-2 block">
              {t('sidebarTitle')}
            </span>

            {/* Menu Items */}
            <button
              onClick={() => setActiveTab('tenants')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-sm font-sans text-xs font-medium tracking-wide transition-all ${
                activeTab === 'tenants'
                  ? 'bg-lacquer text-cream font-semibold'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>{t('partners')}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-xs ${
                activeTab === 'tenants' ? 'bg-cream/20 text-cream' : 'bg-stone/20 text-ash'
              }`}>
                {tenants.length + pendingRegistrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-sm font-sans text-xs font-medium tracking-wide transition-all ${
                activeTab === 'revenue'
                  ? 'bg-lacquer text-cream font-semibold'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4" />
                <span>{t('revenue')}</span>
              </div>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-xs ${
                activeTab === 'revenue' ? 'bg-cream/20 text-cream' : 'bg-stone/20 text-ash'
              }`}>
                {totalCommission.toLocaleString('vi-VN')}đ
              </span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-sm font-sans text-xs font-medium tracking-wide transition-all ${
                activeTab === 'templates'
                  ? 'bg-lacquer text-cream font-semibold'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('templates')}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-sm font-sans text-xs font-medium tracking-wide transition-all ${
                activeTab === 'logs'
                  ? 'bg-lacquer text-cream font-semibold'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4" />
                <span>{t('logs')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-stone/30">
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-lacquer/30 hover:bg-lacquer/10 rounded-xs font-sans text-[10px] font-semibold uppercase tracking-wider text-lacquer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN DISPLAY AREA ── */}
      <main className="flex-grow h-screen overflow-y-auto p-6 md:p-8 bg-parchment relative z-10 flex flex-col items-center">
        {/* Organic grain background layer */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

        <div className="max-w-[1200px] w-full mx-auto space-y-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="space-y-2">
          <SectionLabel label={t('sectionLabel')} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
                {t('pageTitle')}
              </h2>
              <p className="font-sans text-xs text-ash font-light leading-relaxed">
                {t('pageDesc')}
              </p>
            </div>
            
            <button
              onClick={() => {
                setNewVillageName('');
                setNewVillageSlug('');
                setNewEmail('');
                setNewArtisanName(t('placeholderArtisan'));
                setNewPhone(t('placeholderPhone'));
                setNewProvince(t('placeholderProvince'));
                setNewDescription(t('placeholderDesc'));
                setNewTemplate('paper-template');
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-sm hover:brightness-110 shadow-sm transition-all shrink-0 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>{t('btnReceiveOnboarding')}</span>
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

        {/* Tab Controls Navigation (Mobile Only) */}
        <div className="flex border-b border-stone/50 gap-6 overflow-x-auto select-none md:hidden">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'tenants'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('partners')} ({tenants.length + pendingRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'revenue'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('revenue')} ({totalCommission.toLocaleString('vi-VN')}đ)
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'templates'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('templates')}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'logs'
                ? 'border-lacquer text-lacquer font-semibold'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('logs')}
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
                  {t('appDesk')}
                </span>
                <h3 className="font-heading text-xl font-bold italic text-charcoal">
                  {t('pendingApplications', { count: pendingRegistrations.length })}
                </h3>
              </div>

              {pendingRegistrations.length === 0 ? (
                <div className="bg-cream/40 border border-stone/50 border-dashed rounded-sm p-8 text-center text-ash font-light italic">
                  {t('noPendingApplications')}
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
                        {t('statusPending')}
                      </span>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-ash font-sans block">
                          {t('appliedDate', { province: reg.province, date: reg.appliedAt })}
                        </span>
                        <h4 className="font-heading text-lg font-bold italic text-charcoal leading-snug">
                          {reg.name}
                        </h4>
                        <p className="text-[11px] text-ash font-sans font-semibold">
                          {t('artisanName', { name: reg.artisanName, phone: reg.phone })}
                        </p>
                      </div>

                      <p className="text-xs text-ash leading-relaxed font-light font-sans border-t border-b border-stone/30 py-3">
                        {reg.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-medium text-ash">
                        <span>
                          {t('templateStarter', {
                            template: reg.templateId === 'pottery-template'
                              ? t('templatePottery')
                              : reg.templateId === 'silk-template'
                                ? t('templateSilk')
                                : t('templatePaper')
                          })}
                        </span>
                        <span className="font-mono text-bronze uppercase font-semibold">{reg.slug}.hoalang.site</span>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => handleApprove(reg)}
                          disabled={loadingAction !== null}
                          className="flex-grow inline-flex items-center justify-center gap-1.5 bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider py-3 rounded-xs hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100"
                        >
                          {loadingAction === reg.id ? (
                            <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                          )}
                          <span>{loadingAction === reg.id ? t('btnApproveLoading') : t('btnApprove')}</span>
                        </button>
                        <button
                          onClick={() => handleReject(reg)}
                          disabled={loadingAction !== null}
                          className="px-4 py-3 border border-stone hover:border-primary text-ash hover:text-primary font-sans text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('btnReject')}
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
                  {t('directories')}
                </span>
                <h3 className="font-heading text-xl font-bold italic text-charcoal">
                  {t('activeNetwork', { count: tenants.length })}
                </h3>
              </div>

              {/* Search filter bar */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
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
                        <th className="px-6 py-4">{t('tableHeaderVillage')}</th>
                        <th className="px-6 py-4">{t('tableHeaderDomain')}</th>
                        <th className="px-6 py-4">{t('tableHeaderTemplate')}</th>
                        <th className="px-6 py-4">{t('tableHeaderDate')}</th>
                        <th className="px-6 py-4">{t('tableHeaderDb')}</th>
                        <th className="px-6 py-4">{t('tableHeaderStatus')}</th>
                        <th className="px-6 py-4 text-center">{t('tableHeaderActions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/20">
                      {filteredTenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-ash font-light italic">
                            {t('noResults')}
                          </td>
                        </tr>
                      ) : (
                        filteredTenants.map(tItem => (
                          <tr key={tItem.id} className="hover:bg-stone/5 transition-colors">
                            {/* Name & ID */}
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-heading text-[15px] font-semibold text-charcoal italic leading-tight">
                                  {tItem.name}
                                </span>
                                <span className="text-[10px] text-ash font-light mt-0.5">
                                  {tItem.category} • Tỉnh {tItem.province}
                                </span>
                              </div>
                            </td>

                            {/* Domain */}
                            <td className="px-6 py-4 font-mono font-medium text-bronze">
                              {tItem.slug.replace(/-/g, '')}.hoalang.site
                            </td>

                            {/* Template */}
                            <td className="px-6 py-4 text-ash font-medium">
                              {t(tItem.templateId === 'pottery-template'
                                ? 'templatePottery'
                                : tItem.templateId === 'silk-template'
                                  ? 'templateSilk'
                                  : 'templatePaper')}
                            </td>

                            {/* Creation Date */}
                            <td className="px-6 py-4 text-ash">
                              {tItem.createdAt}
                            </td>

                            {/* Database Status */}
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 font-semibold text-[8px] uppercase text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-xs">
                                <Database className="w-2.5 h-2.5 text-green-600" />
                                <span>{tItem.dbStatus}</span>
                              </span>
                            </td>

                            {/* Live/Draft Status */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 border rounded-xs text-[9px] font-semibold uppercase tracking-wider ${
                                tItem.status === 'Published'
                                  ? 'border-accent/40 bg-accent/15 text-gold'
                                  : 'border-stone bg-transparent text-ash'
                              }`}>
                                {tItem.status === 'Published' ? 'LIVE' : 'DRAFT'}
                              </span>
                            </td>

                            {/* Action triggers */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleSyncDb(tItem.id, tItem.name)}
                                  disabled={loadingAction !== null}
                                  title={t('actionSyncDb')}
                                  className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash hover:text-charcoal rounded-xs transition-all disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === tItem.id ? 'animate-spin text-lacquer' : ''}`} />
                                </button>
                                
                                <button
                                  onClick={() => handleToggleStatus(tItem.id)}
                                  title={tItem.status === 'Published' ? t('actionToggleDraft') : t('actionTogglePublish')}
                                  className={`p-2 border rounded-xs transition-all ${
                                    tItem.status === 'Published'
                                      ? 'border-lacquer/30 hover:bg-lacquer/10 text-lacquer'
                                      : 'border-accent/30 hover:bg-accent/10 text-gold'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>

                                <a
                                  href={getTenantUrl(tItem.slug, 'vi')}
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
                        {t('ratesTitle')}
                      </span>
                      <h4 className="font-heading text-lg italic font-bold text-charcoal">
                        {t('transactionFee')}
                      </h4>
                    </div>
                    <Coins className="w-5 h-5 text-gold" />
                  </div>

                  <div className="space-y-4 font-sans text-xs">
                    <p className="font-sans text-[11px] font-light text-ash leading-relaxed">
                      {t('feeDesc')}
                    </p>

                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-charcoal">{t('feeDiscountRate')}</span>
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
                          
                          toast.success(t('toastRateUpdate', { rate: newRate.toFixed(1) }), {
                            description: t('toastRateUpdateDesc')
                          });
                        }}
                        className="w-full accent-lacquer cursor-pointer"
                      />
                    </div>

                    <div className="bg-parchment/60 border border-stone/50 p-4 rounded-xs text-[11px] leading-relaxed text-ash font-light">
                      <span className="text-lacquer font-semibold block mb-0.5">{t('feeAutoRules')}</span>
                      {t('feeAutoRulesDesc')}
                    </div>
                  </div>
                </div>

                {/* Revenue Share breakdown Chart via Pure CSS and Tailwind */}
                <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-gold font-sans block">
                      {t('marketShareTitle')}
                    </span>
                    <h4 className="font-heading text-lg italic font-bold text-charcoal border-b border-stone/30 pb-2">
                      {t('marketShareSub')}
                    </h4>
                  </div>

                  <div className="space-y-4 pt-1 font-sans text-xs">
                    {/* Bat Trang */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">{t('templatePottery')}</span>
                        <span className="font-mono font-semibold">58%</span>
                      </div>
                      <div className="w-full bg-stone/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-lacquer h-full" style={{ width: '58%' }} />
                      </div>
                    </div>

                    {/* Van Phuc */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">{t('templateSilk')}</span>
                        <span className="font-mono font-semibold">35%</span>
                      </div>
                      <div className="w-full bg-stone/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full" style={{ width: '35%' }} />
                      </div>
                    </div>

                    {/* Dong Ho */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-ash">
                        <span className="text-charcoal">{t('templatePaper')}</span>
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
                          {t('ledgerTitle')}
                        </span>
                        <h3 className="font-heading text-xl font-bold italic text-charcoal">
                          {t('ledgerSub')}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-xs shadow-xs">
                        {t('ledgerTotalFee', { total: totalCommission.toLocaleString('vi-VN') })}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full font-sans text-xs border-collapse text-left">
                        <thead>
                          <tr className="border-b border-stone/30 font-semibold uppercase tracking-wider text-ash text-[9px] bg-stone/5">
                            <th className="p-3">{t('tableHeaderTxnId')}</th>
                            <th className="p-3">{t('tableHeaderTxnTenant')}</th>
                            <th className="p-3">{t('tableHeaderTxnAmount')}</th>
                            <th className="p-3">{t('tableHeaderTxnFee', { rate: commissionRate })}</th>
                            <th className="p-3">{t('tableHeaderTxnDate')}</th>
                            <th className="p-3 text-center">{t('tableHeaderTxnStatus')}</th>
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
                                  <span>{t('txnStatusCollected')}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone/30 text-xs font-sans font-light text-ash text-center italic">
                    {t('txnFooterText')}
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
                {t('starterTemplate')} 01
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                {t('templatePottery')}
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                {t('descPottery')}
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>{t('activeVillages', { count: 4 })}</span>
                <span className="text-gold uppercase tracking-wider font-semibold">{t('modePremium')}</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                {t('starterTemplate')} 02
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                {t('templateSilk')}
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                {t('descSilk')}
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>{t('activeVillages', { count: 3 })}</span>
                <span className="text-gold uppercase tracking-wider font-semibold">{t('modePremium')}</span>
              </div>
            </div>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ash font-sans block">
                {t('starterTemplate')} 03
              </span>
              <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                {t('templatePaper')}
              </h4>
              <p className="text-xs text-ash leading-relaxed font-light font-sans">
                {t('descPaper')}
              </p>
              <div className="pt-3 border-t border-stone/30 flex justify-between text-[11px] font-medium text-ash font-sans">
                <span>{t('activeVillages', { count: 5 })}</span>
                <span className="text-gold uppercase tracking-wider font-semibold font-medium">{t('modeStandard')}</span>
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
                  {t('serverAuditing')}
                </span>
                <h4 className="font-heading text-xl italic font-semibold text-charcoal">
                  {t('operationalLogs')}
                </h4>
              </div>
              
              <button
                onClick={() => {
                  fetchAdminDashboardData();
                  toast.success(t('toastLogsRefresh'));
                }}
                className="p-2 border border-stone hover:border-bronze hover:bg-stone/10 text-ash rounded-xs transition-all active:scale-[0.97]"
                title={t('refreshLogs')}
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

        {/* ── PREMIUM OVERLAY REGISTRATION MODAL ── */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-parchment border border-stone rounded-sm max-w-lg w-full overflow-hidden shadow-lg p-6 relative z-10 flex flex-col gap-5 text-left select-none max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-stone/20 rounded-full transition-colors text-ash hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                    {t('modalSaasTenant')}
                  </span>
                  <h3 className="font-heading text-2xl font-bold italic text-charcoal">
                    {t('modalTitle')}
                  </h3>
                </div>

                <div className="h-px bg-stone/40 w-full" />

                <form onSubmit={handleSubmitNewVillage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelName')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t('placeholderName')}
                        value={newVillageName}
                        onChange={(e) => {
                          setNewVillageName(e.target.value);
                          // Auto generate clean slug
                          const genSlug = e.target.value
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[đĐ]/g, "d")
                            .replace(/[^a-z0-9\s-]/g, "")
                            .trim()
                            .replace(/\s+/g, "-");
                          setNewVillageSlug(genSlug);
                        }}
                        className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink placeholder-ash/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelSlug')}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          required
                          placeholder={t('placeholderSlug')}
                          value={newVillageSlug}
                          onChange={(e) => setNewVillageSlug(e.target.value)}
                          className="w-full border border-stone bg-cream py-2.5 pl-2.5 pr-20 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink placeholder-ash/50 transition-colors font-mono font-semibold"
                        />
                        <span className="absolute right-2.5 font-mono text-[9px] font-semibold text-ash/80 select-none">
                          .hoalang.site
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                      {t('modalLabelEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t('placeholderEmail')}
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink placeholder-ash/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelArtisan')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('placeholderArtisan')}
                        value={newArtisanName}
                        onChange={(e) => setNewArtisanName(e.target.value)}
                        className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelPhone')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('placeholderPhone')}
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelProvince')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('placeholderProvince')}
                        value={newProvince}
                        onChange={(e) => setNewProvince(e.target.value)}
                        className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                        {t('modalLabelTemplate')}
                      </label>
                      <select
                        value={newTemplate}
                        onChange={(e) => setNewTemplate(e.target.value)}
                        className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink transition-colors"
                      >
                        <option value="paper-template">{t('templatePaper')}</option>
                        <option value="pottery-template">{t('templatePottery')}</option>
                        <option value="silk-template">{t('templateSilk')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ash mb-1 block">
                      {t('modalLabelDesc')}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={t('placeholderDesc')}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full border border-stone bg-cream p-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-bronze text-ink transition-colors resize-none"
                    />
                  </div>

                  <div className="h-px bg-stone/30 w-full pt-1" />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-3 border border-stone hover:border-bronze bg-transparent text-charcoal font-sans text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98]"
                    >
                      {t('btnCancel')}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider px-6 py-3 rounded-xs hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>{t('btnConfirm')}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Generated Credentials */}
        <AnimatePresence>
          {credentialsModalOpen && generatedCredentials && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCredentialsModalOpen(false)}
                className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-parchment border border-stone rounded-sm max-w-md w-full overflow-hidden shadow-lg p-6 relative z-10 flex flex-col gap-5 text-left select-none"
              >
                {/* Close Button */}
                <button
                  onClick={() => setCredentialsModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-stone/20 rounded-full transition-colors text-ash hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                    {t('credentialsSuccess')}
                  </span>
                  <h3 className="font-heading text-2xl font-bold italic text-charcoal">
                    {t('credentialsTitle')}
                  </h3>
                </div>

                <div className="h-px bg-stone/40 w-full" />

                <div className="space-y-3 font-sans text-xs">
                  <p className="text-ash font-light">
                    {t('credentialsDesc', { tenant: generatedCredentials.tenantName })}
                  </p>

                  <div className="bg-cream border border-stone p-4 rounded-sm space-y-2">
                    <p className="text-charcoal"><strong>{t('credentialsFullName')}</strong> {generatedCredentials.fullName}</p>
                    <p className="text-charcoal"><strong>{t('credentialsEmail')}</strong> {generatedCredentials.email}</p>

                    <p className="text-charcoal">
                      <strong>{t('credentialsWebsite')}</strong>{' '}
                      <a
                        href={`http://${generatedCredentials.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bronze underline font-semibold"
                      >
                        {generatedCredentials.subdomain}
                      </a>
                    </p>
                  </div>

                  <p className="text-ash text-[10px] italic leading-relaxed">
                    {t('credentialsFooter')}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCredentialsModalOpen(false)}
                    className="bg-primary text-primary-foreground font-sans text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all"
                  >
                    Đóng / Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Rejection Reason */}
        <AnimatePresence>
          {rejectingRequest && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRejectingRequest(null)}
                className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-parchment border border-stone rounded-sm max-w-md w-full overflow-hidden shadow-lg p-6 relative z-10 flex flex-col gap-5 text-left select-none"
              >
                {/* Close Button */}
                <button
                  onClick={() => setRejectingRequest(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-stone/20 rounded-full transition-colors text-ash hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                    {t('rejectModalLabel')}
                  </span>
                  <h3 className="font-heading text-2xl font-bold italic text-charcoal">
                    {t('rejectModalTitle')}
                  </h3>
                </div>

                <div className="h-px bg-stone/40 w-full" />

                <div className="space-y-3 font-sans text-xs">
                  <p className="text-ash font-light leading-relaxed">
                    {t('rejectModalDesc', { name: rejectingRequest.name })}
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-charcoal">
                      {t('rejectReasonLabel')} <span className="text-lacquer">*</span>
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={t('rejectReasonPlaceholder')}
                      rows={4}
                      className="w-full bg-cream border border-stone rounded-sm px-3 py-2.5 text-sm text-ink font-sans font-light placeholder:text-ash/60 focus:outline-none focus:border-bronze transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 bg-cream border border-stone/60 p-3 rounded-sm">
                    <MessageSquareWarning className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-ash text-[10px] italic leading-relaxed">
                      {t('rejectModalNote')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setRejectingRequest(null)}
                    className="px-5 py-3 border border-stone text-ash font-sans text-[10px] font-bold uppercase tracking-wider rounded-sm hover:border-charcoal hover:text-charcoal transition-all"
                  >
                    {t('rejectModalCancel')}
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    disabled={!rejectReason.trim() || loadingAction === rejectingRequest.id}
                    className="bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAction === rejectingRequest.id ? t('rejectModalSending') : t('rejectModalConfirm')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  </div>
  );
}
