'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Link } from '@/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Compass, User, Mail, Lock, Sparkles, ArrowRight, Loader2, Phone } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import api from '@/lib/api';

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRole] = useState<'USER' | 'VILLAGE_OWNER'>('USER');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        fullName: name,
        email,
        phone,
        password,
        role: activeRole,
      });

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || 'Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.'
        );
        router.push('/auth/login');
      } else {
        toast.error(response.data?.message || 'Đăng ký tài khoản thất bại.');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      const axiosError = err as {
        response?: {
          data?: {
            message?: string;
          } | string;
        };
        message?: string;
      };
      
      if (axiosError.response?.data) {
        // Backend JSON error payload
        if (typeof axiosError.response.data === 'object' && axiosError.response.data.message) {
          const rawMsg = axiosError.response.data.message;
          
          if (rawMsg.includes('Input validation failed:')) {
            // Parse and translate validation errors beautifully
            const fields = rawMsg.replace('Input validation failed: ', '').split('; ');
            const translatedFields = fields.map((f: string) => {
              if (f.toLowerCase().includes('phone')) {
                return 'Số điện thoại phải chứa chính xác 10 chữ số.';
              }
              if (f.toLowerCase().includes('password')) {
                return 'Mật khẩu tối thiểu 6 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt.';
              }
              if (f.toLowerCase().includes('fullname')) {
                return 'Họ và tên phải có độ dài từ 2 ký tự trở lên.';
              }
              return f;
            });
            errorMessage = `Thông tin nhập liệu không hợp lệ:\n• ${translatedFields.join('\n• ')}`;
          } else if (
            rawMsg.includes('duplicate value for key: email') || 
            rawMsg.includes('already in use') || 
            rawMsg.includes('Unique restriction')
          ) {
            errorMessage = 'Địa chỉ Email này đã được sử dụng trên hệ thống.';
          } else {
            errorMessage = rawMsg;
          }
        } else if (typeof axiosError.response.data === 'string') {
          if (axiosError.response.data.includes('<!DOCTYPE html>') || axiosError.response.data.includes('<html')) {
            errorMessage = 'Lỗi kết nối: Không thể kết nối tới máy chủ Back-End (404 Not Found).';
          } else {
            errorMessage = axiosError.response.data;
          }
        }
      } else if (axiosError.message) {
        // Network/Axios general error
        errorMessage = axiosError.message;
      }

      toast.error(errorMessage, {
        style: {
          whiteSpace: 'pre-line', // Preserve newline formatting for bullet list
        }
      });
    } finally {
      setLoading(false);
    }
  };


  if (!mounted) {
    return (
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-parchment select-none overflow-hidden relative">
      {/* Organic grain background layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      {/* ── LEFT COLUMN: Luxury Editorial Presentation (Silk Weaving Theme) ── */}
      <div className="hidden md:flex md:w-1/2 bg-charcoal text-cream flex-col justify-between p-12 relative overflow-hidden shrink-0 border-r border-stone/20">
        {/* Gorgeous generated silk background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0" 
          style={{ backgroundImage: "url('/images/register_silk_bg.png')" }}
        />
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />
        
        {/* Decorative corner borders */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/40" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/40" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/40" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/40" />

        {/* Header brand logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10 self-start">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="2" width="16.97" height="16.97" rx="1.5" transform="rotate(45 14 2)" stroke="#C4952A" strokeWidth="1.8" fill="none" />
            <rect x="14" y="8" width="8.49" height="8.49" transform="rotate(45 14 8)" fill="#C4952A" opacity="0.9" />
            <circle cx="14" cy="14" r="1.5" fill="#FAF7F2" />
          </svg>
          <span className="font-heading font-semibold text-2xl tracking-wide text-cream group-hover:text-gold transition-colors">
            HoaLang
          </span>
        </Link>

        {/* Centerpiece Quote block */}
        <div className="space-y-6 relative z-10 my-auto text-left max-w-lg mx-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
            Giao diện tinh hoa / Premium Experience
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-light italic text-cream leading-tight">
            Dệt nên sợi chỉ thời gian,<br />
            gìn giữ tinh hoa bản sắc.
          </h1>
          <p className="font-sans text-xs text-cream/70 leading-relaxed font-light">
            Nhập cuộc vào hành trình số hóa di sản Việt Nam. Khởi tạo một website độc bản riêng cho làng nghề của bạn, kết nối giao thương trực tuyến các mặt hàng thủ công mỹ nghệ chân thực và đón tiếp khách du lịch trải nghiệm văn hóa.
          </p>

          <OrnamentDivider className="text-gold/30 !justify-start" />

          {/* Core analytical attributes */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <span className="text-xl font-heading font-bold italic text-gold block">120+</span>
              <span className="text-[9px] uppercase tracking-wider text-cream/60 block">Hợp tác Làng nghề / Partner Villages</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl font-heading font-bold italic text-gold block">Templates</span>
              <span className="text-[9px] uppercase tracking-wider text-cream/60 block">Độc quyền văn hóa / Custom Fine Arts</span>
            </div>
          </div>
        </div>

        {/* Footer brand info */}
        <div className="flex items-center justify-between text-[10px] text-cream/45 relative z-10 font-sans tracking-wide">
          <span>&copy; {new Date().getFullYear()} HoaLang Platform</span>
          <span>Tinh hoa Làng nghề Việt / Artisanal Heritage</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Splendid Registration Form Panel ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 md:hidden">
          <Compass className="w-5 h-5 text-lacquer" />
          <span className="font-heading font-semibold text-xl text-charcoal">
            HoaLang
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[420px] w-full bg-cream border border-stone/80 rounded-sm p-8 shadow-sm hover:shadow-hover transition-all duration-500"
        >
          {/* Form Header */}
          <div className="space-y-2 text-left mb-6">
            <SectionLabel label="Khởi tạo tài khoản / Join the platform" />
            <h2 className="font-heading text-3xl font-bold italic text-charcoal leading-none">
              {t('auth.registerTitle')}
            </h2>
            <p className="font-sans text-xs text-ash font-light leading-relaxed">
              {activeRole === 'USER'
                ? 'Tạo tài khoản du khách để khám phá bản đồ di sản Việt Nam và trải nghiệm văn hóa truyền thống.'
                : 'Tạo tài khoản nghệ nhân đại diện để sở hữu hệ thống quản trị và thiết kế website làng nghề.'}
            </p>
          </div>

          {/* Role Switching Premium Tabs */}
          <div className="flex border border-stone rounded-xs mb-6 overflow-hidden bg-parchment/40 p-0.5 select-none">
            <button
              type="button"
              onClick={() => setActiveRole('USER')}
              className={`flex-1 py-2.5 text-[9px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 rounded-xs ${
                activeRole === 'USER'
                  ? 'bg-lacquer text-cream shadow-xs'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              Du Khách / Traveler
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('VILLAGE_OWNER')}
              className={`flex-1 py-2.5 text-[9px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 rounded-xs ${
                activeRole === 'VILLAGE_OWNER'
                  ? 'bg-lacquer text-cream shadow-xs'
                  : 'text-ash hover:text-charcoal hover:bg-stone/10'
              }`}
            >
              Chủ Làng Nghề / Artisan Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input field: Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>
                  {activeRole === 'USER' ? 'Họ và tên của bạn / Full Name' : 'Họ và tên nghệ nhân / Artisan Name'}
                </span>
              </label>
              
              <input
                type="text"
                placeholder={activeRole === 'USER' ? 'Ví dụ: Nguyễn Văn A' : 'Ví dụ: Nghệ nhân Nguyễn Văn A'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
              />
            </div>

            {/* Input field: Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>{t('auth.emailLabel')}</span>
              </label>
              
              <input
                type="email"
                placeholder={activeRole === 'USER' ? 'Ví dụ: nva@gmail.com' : 'Ví dụ: owner@battrang.vn'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
              />
            </div>

            {/* Input field: Phone */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>Số điện thoại / Phone Number</span>
              </label>
              
              <input
                type="text"
                placeholder="Ví dụ: 0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
              />
            </div>

            {/* Input field: Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>{t('auth.passwordLabel')}</span>
              </label>
              
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
              />
            </div>

            {/* Helper platform benefits info */}
            <div className="bg-parchment border border-stone rounded-xs p-3.5 text-left space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeRole === 'USER' ? 'Quyền lợi tài khoản du khách' : 'Quyền lợi tài khoản nghệ nhân'}
                </span>
              </span>
              <ul className="text-[10px] text-ash space-y-1 list-none font-sans font-light leading-normal">
                {activeRole === 'USER' ? (
                  <>
                    <li>• Khám phá bản đồ nghệ thuật tương tác 3D.</li>
                    <li>• Lên lộ trình trải nghiệm và đặt trước khóa học.</li>
                    <li>• Trực tiếp mua sắm sản phẩm thủ công chính gốc.</li>
                  </>
                ) : (
                  <>
                    <li>• Khởi tạo 1 Website Làng nghề chuẩn SEO.</li>
                    <li>• Quản lý danh mục tác phẩm và khóa học trải nghiệm.</li>
                    <li>• AI đề xuất lộ trình trải nghiệm cho khách du lịch.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Form action submission */}
            <div className="space-y-4 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Ký Tài Khoản</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-ash leading-relaxed font-light">
                {t('auth.hasAccount')}{' '}
                <Link href="/auth/login" className="text-bronze hover:text-lacquer font-semibold underline transition-colors">
                  {t('auth.submitLogin')}
                </Link>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
