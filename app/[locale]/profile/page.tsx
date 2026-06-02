'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authService, UserProfile } from '@/lib/services/authService';
import { PageHeader, TagBadge, OrnamentDivider } from '@/components/shared';
import { motion } from 'framer-motion';
import { Compass, Mail, Phone, Shield, Wallet, User as UserIcon, LogOut, Camera, Save, X, Edit3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  },
};

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Editing form states
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form errors
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const fetchProfile = async () => {
        setLoading(true);
        const data = await authService.getMe();
        if (data) {
          setProfile(data);
          setFullName(data.fullName || '');
          setPhone(data.phone || '');
        } else {
          toast.error(t('notAvailable') || 'Không thể đồng bộ thông tin hồ sơ.');
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center selection:bg-lacquer/10 selection:text-lacquer">
        <Compass className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    );
  }

  // Handle local avatar select preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Generate object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Reset form states
  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setNameError('');
    setPhoneError('');
    setIsEditing(false);
  };

  // Save profile updates
  const handleSave = async () => {
    let hasError = false;

    // Validate Full Name
    if (fullName.trim().length < 2) {
      setNameError(t('nameError') || 'Họ tên phải dài ít nhất 2 ký tự.');
      hasError = true;
    } else {
      setNameError('');
    }

    // Validate Phone (Exactly 10 digits if filled)
    if (phone && !/^\d{10}$/.test(phone)) {
      setPhoneError(t('phoneError') || 'Số điện thoại phải gồm đúng 10 chữ số.');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('phone', phone.trim());
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updated = await authService.updateProfile(formData);
      if (updated) {
        setProfile(updated);
        
        // Update Zuztand Auth Store immediately
        const mappedUser = {
          id: updated._id,
          email: updated.email,
          name: updated.fullName,
          role: updated.role.toLowerCase(),
          avatar: updated.avatar,
        };
        setUser(mappedUser);

        toast.success(t('updateSuccess') || 'Cập nhật hồ sơ thành công!');
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        toast.error(t('updateFailed') || 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error('[ProfilePage] Save failed:', error);
      toast.error(t('updateFailed') || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  // Format currency balance properly based on locale
  const formatBalance = (balance: number) => {
    try {
      if (locale === 'vi') {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(balance);
      }
      return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale, {
        style: 'currency',
        currency: 'USD',
      }).format(balance);
    } catch {
      return `${balance.toLocaleString()} ₫`;
    }
  };

  // Helper to map role keys to translations and badge styles
  const getRoleInfo = (role: string) => {
    const r = role.toUpperCase();
    switch (r) {
      case 'ADMIN':
        return {
          label: t('roleAdmin'),
          variant: 'lacquer' as const,
        };
      case 'VILLAGE_OWNER':
        return {
          label: t('roleOwner'),
          variant: 'gold' as const,
        };
      case 'USER':
      default:
        return {
          label: t('roleUser'),
          variant: 'stone' as const,
        };
    }
  };

  const roleInfo = profile ? getRoleInfo(profile.role) : user ? getRoleInfo(user.role) : null;

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* Premium light variant page header */}
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('breadcrumb'), href: '/profile' }]}
        variant="light"
      />

      <div className="max-w-[800px] mx-auto px-6 pt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
            <p className="font-sans text-xs uppercase tracking-widest text-ash">
              {t('loading')}
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full bg-cream border border-stone/80 rounded-sm p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Organic grain background layer */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />

            {/* Decorative classic gold corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30 pointer-events-none" />

            {/* Card Header section: User Avatar & Basic Info */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-stone/40">
              
              {/* Avatar Container with camera hover trigger in edit mode */}
              <div className="w-20 h-20 rounded-sm overflow-hidden border border-stone shrink-0 bg-parchment flex items-center justify-center relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-600 ease-out-expo"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-heading text-4xl italic text-cream bg-lacquer">
                    {(fullName || profile?.fullName || user?.name || 'H').slice(0, 1).toUpperCase()}
                  </div>
                )}

                {/* Camera icon overlay in edit mode */}
                {isEditing && (
                  <label className="absolute inset-0 bg-charcoal/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-5 h-5 text-cream" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-grow">
                {roleInfo && (
                  <TagBadge label={roleInfo.label} variant={roleInfo.variant} />
                )}
                
                {isEditing ? (
                  <div className="pt-1">
                    <p className="font-sans text-[10px] text-ash tracking-wide uppercase font-semibold">
                      {profile?.email || user?.email}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-none">
                      {profile?.fullName || user?.name || 'Tài khoản di sản'}
                    </h2>
                    <p className="font-sans text-xs text-ash tracking-wide leading-none">
                      {profile?.email || user?.email}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Metadata Fields Section */}
            <div className="relative z-10 py-8 space-y-6">
              
              {/* Field: Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-stone/20">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2 select-none">
                  <UserIcon className="w-3.5 h-3.5 text-gold" />
                  {t('fullName')}
                </span>

                {isEditing ? (
                  <div className="flex flex-col w-full sm:max-w-md">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (e.target.value.trim().length >= 2) setNameError('');
                      }}
                      className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-3 py-2 font-sans text-xs text-charcoal transition-colors"
                    />
                    {nameError && (
                      <span className="text-[10px] text-lacquer mt-1 font-sans font-semibold tracking-wide">
                        {nameError}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-sans text-sm font-medium text-charcoal">
                    {profile?.fullName || user?.name || t('notAvailable')}
                  </span>
                )}
              </div>

              {/* Field: Email */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-stone/20">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2 select-none">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  {t('email')}
                </span>
                <span className="font-sans text-sm font-medium text-charcoal select-all">
                  {profile?.email || user?.email}
                </span>
              </div>

              {/* Field: Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-stone/20">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2 select-none">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  {t('phone')}
                </span>

                {isEditing ? (
                  <div className="flex flex-col w-full sm:max-w-md">
                    <input
                      type="text"
                      value={phone}
                      placeholder="0987654321"
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (/^\d{10}$/.test(e.target.value)) setPhoneError('');
                      }}
                      className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-3 py-2 font-sans text-xs text-charcoal transition-colors"
                    />
                    {phoneError && (
                      <span className="text-[10px] text-lacquer mt-1 font-sans font-semibold tracking-wide">
                        {phoneError}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-sans text-sm font-medium text-charcoal">
                    {profile?.phone || t('notAvailable')}
                  </span>
                )}
              </div>

              {/* Field: Role */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-stone/20 select-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  {t('role')}
                </span>
                <span className="font-sans text-sm font-medium text-charcoal">
                  {roleInfo?.label || t('notAvailable')}
                </span>
              </div>

              {/* Field: Wallet Balance */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-stone/20 select-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-gold" />
                  {t('walletBalance')}
                </span>
                <span className="font-heading text-lg font-bold text-lacquer">
                  {profile ? formatBalance(profile.walletBalance || 0) : '0 ₫'}
                </span>
              </div>
            </div>

            {/* Editorial Divider */}
            <OrnamentDivider className="relative z-10 opacity-70" />

            {/* Action Buttons */}
            <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t('saving')}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{t('btnSave')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="w-full sm:w-auto bg-transparent border border-stone text-ash hover:text-charcoal hover:border-charcoal font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t('btnCancel')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t('btnEdit')}</span>
                  </button>

                  <button
                    onClick={() => logout()}
                    className="w-full sm:w-auto bg-transparent border border-stone text-ash hover:text-lacquer hover:border-lacquer font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{tNav('logout')}</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
