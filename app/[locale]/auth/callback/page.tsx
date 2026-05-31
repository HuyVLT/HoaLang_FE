'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const t = useTranslations('auth');
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userRaw = searchParams.get('user');

    if (!accessToken || !refreshToken || !userRaw) {
      console.error('[OAuth Callback] Missing tokens or user parameters.');
      setErrorOccurred(true);
      toast.error('Xác thực OAuth thất bại hoặc thiếu tham số.');
      setTimeout(() => {
        router.replace('/auth/login');
      }, 3000);
      return;
    }

    try {
      const decodedUser = JSON.parse(decodeURIComponent(userRaw));
      
      // Map properties to match frontend User schema
      const mappedUser = {
        id: decodedUser.id,
        email: decodedUser.email,
        name: decodedUser.fullName || decodedUser.name,
        role: decodedUser.role.toLowerCase(), // lowcase for state consistency
        avatar: decodedUser.avatar,
      };

      // Hydrate state store & cookies
      login(mappedUser, accessToken, refreshToken);
      toast.success('Đăng nhập qua Google thành công!');

      // Redirect dynamically based on role
      setTimeout(() => {
        if (mappedUser.role === 'admin') {
          router.replace('/admin');
        } else if (mappedUser.role === 'village_owner') {
          router.replace('/dashboard');
        } else {
          router.replace('/');
        }
      }, 1500);
    } catch (error) {
      console.error('[OAuth Callback] Parsing user failed:', error);
      setErrorOccurred(true);
      toast.error('Lỗi phân tích thông tin tài khoản OAuth.');
      router.replace('/auth/login');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-parchment relative overflow-hidden px-6 select-none">
      {/* Background grain texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
      
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-stone/40" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-stone/40" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-stone/40" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-stone/40" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[460px] w-full bg-cream border border-stone/80 rounded-sm p-8 text-center shadow-md relative z-10 space-y-6"
      >
        <div className="flex justify-center relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-16 h-16 border-2 border-stone border-t-lacquer rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-gold" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
            Google Single-Sign-On
          </span>
          <h2 className="font-heading text-3xl font-light italic text-charcoal">
            {errorOccurred ? 'Xác thực không thành công' : t('oauthCallback')}
          </h2>
          <p className="font-sans text-xs text-ash leading-relaxed font-light">
            {errorOccurred 
              ? 'Đang chuyển hướng bạn quay lại trang đăng nhập...'
              : t('oauthRedirecting')}
          </p>
        </div>

        <div className="w-12 h-[1px] bg-stone/60 mx-auto" />

        <div className="flex items-center justify-center gap-2 text-[10px] text-ash tracking-wider uppercase">
          <span>HoaLang Platform</span>
          <span>•</span>
          <span>Artisanal Heritage</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
