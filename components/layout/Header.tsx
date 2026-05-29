'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import LanguageSwitcher from './LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag, LogOut } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    // Set initial state in case page loads already scrolled
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tenant') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: '/map',         label: t('map') },
    { href: '/#villages',   label: t('villages') },
    { href: '/#itinerary',  label: t('itinerary') },
    { href: '/#shop',       label: t('shop') },
    { href: '/#experience', label: t('experience') },
  ];

  // Color tokens based on scroll state
  const textColor    = scrolled ? '#2E2318' : '#FAF7F2';
  const activeColor  = scrolled ? '#8B1A1A' : '#C4952A';
  const subtleColor  = scrolled ? '#8C8070' : 'rgba(250,247,242,0.65)';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? { background: 'rgba(245,240,232,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D4C9B5' }
          : { background: 'linear-gradient(to bottom, rgba(26,18,8,0.55) 0%, rgba(26,18,8,0.15) 60%, rgba(26,18,8,0) 100%)' }
      }
    >
      <div className="flex h-16 items-center w-full" style={{ paddingInline: 'clamp(16px, 4vw, 64px)' }}>

        {/* ── LEFT: Logo — sát trái ── */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2.5 group transition-all duration-300"
        >
          {/* SVG logo mark */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer diamond ring */}
            <rect
              x="14" y="2"
              width="16.97" height="16.97"
              rx="1.5"
              transform="rotate(45 14 2)"
              stroke={scrolled ? '#8B1A1A' : '#C4952A'}
              strokeWidth="1.8"
              fill="none"
            />
            {/* Inner filled diamond */}
            <rect
              x="14" y="8"
              width="8.49" height="8.49"
              transform="rotate(45 14 8)"
              fill={scrolled ? '#8B1A1A' : '#C4952A'}
              opacity="0.9"
            />
            {/* Center dot */}
            <circle cx="14" cy="14" r="1.5" fill={scrolled ? '#F5F0E8' : '#FAF7F2'} />
          </svg>

          {/* Wordmark */}
          <span
            className="font-heading font-semibold leading-none select-none transition-colors duration-300 group-hover:text-gold"
            style={{
              fontSize: '26px',
              color: scrolled ? '#8B1A1A' : '#FAF7F2',
              textShadow: scrolled
                ? 'none'
                : '0 1px 4px rgba(26,18,8,0.3)',
            }}
          >
            HoaLang
          </span>
        </Link>

        {/* ── CENTER: Nav links — căn giữa tuyệt đối ── */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 h-16 font-sans">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center h-full font-semibold uppercase tracking-[0.10em] text-[12px] transition-colors duration-200"
                style={{ color: isActive ? activeColor : textColor }}
              >
                {link.label}
                {/* Active underline — absolute, zero impact on row height */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-300 origin-left"
                  style={{
                    background: activeColor,
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── RIGHT: Language + Cart + Auth — sát phải ── */}
        <div className="flex items-center gap-4 ml-auto shrink-0">

          {/* Language switcher */}
          <LanguageSwitcher variant={scrolled ? 'dark' : 'light'} />

          {/* Cart icon */}
          <Link
            href="/shop"
            className="relative flex items-center justify-center w-8 h-8 transition-colors duration-300"
            style={{ color: textColor }}
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {mounted && totalCartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none"
                style={{ background: '#8B1A1A', color: '#FAF7F2' }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Auth — desktop only */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <>
                <span
                  className="font-sans text-[12px] max-w-[120px] truncate transition-colors duration-300"
                  style={{ color: subtleColor }}
                >
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300"
                  style={{ color: subtleColor }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                {/* Đăng nhập — ghost */}
                <Link
                  href="/auth/login"
                  className="font-sans text-[12px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 hover:opacity-75"
                  style={{ color: textColor }}
                >
                  {t('login')}
                </Link>

                {/* Đăng ký — lacquer filled button */}
                <Link
                  href="/auth/register"
                  className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-2 rounded-[3px] transition-all duration-200 hover:opacity-90 whitespace-nowrap"
                  style={{ background: '#8B1A1A', color: '#FAF7F2' }}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <button
                    aria-label="Mở menu"
                    className="flex items-center justify-center w-8 h-8 transition-colors duration-300"
                    style={{ color: textColor }}
                  />
                }
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-72 p-0 font-sans"
                style={{ background: '#F5F0E8', borderLeft: '1px solid #D4C9B5' }}
              >
                <div className="flex flex-col h-full p-6 gap-0">
                  {/* Mobile logo */}
                  <Link href="/" className="font-heading font-semibold text-lacquer leading-none mb-8 block" style={{ fontSize: '24px' }}>
                    HoaLang
                  </Link>

                  {/* Mobile nav links */}
                  <nav className="flex flex-col flex-1">
                    {navLinks.map((link) => {
                      const isActive =
                        pathname === link.href ||
                        (link.href !== '/' && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] py-4 border-b flex items-center justify-between transition-colors"
                          style={{
                            color: isActive ? '#8B1A1A' : '#2E2318',
                            borderColor: '#D4C9B5',
                          }}
                        >
                          {link.label}
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8B1A1A' }} />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile auth */}
                  <div className="flex flex-col gap-2 pt-6 mt-auto border-t" style={{ borderColor: '#D4C9B5' }}>
                    {mounted && isAuthenticated ? (
                      <>
                        <span className="font-sans text-[11px] uppercase tracking-wider" style={{ color: '#8C8070' }}>
                          {user?.name || user?.email}
                        </span>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-widest py-2"
                          style={{ color: '#8C8070' }}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t('logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] py-3 border text-center rounded-[3px] transition-colors"
                          style={{ color: '#2E2318', borderColor: '#D4C9B5' }}
                        >
                          {t('login')}
                        </Link>
                        <Link
                          href="/auth/register"
                          className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] py-3 text-center rounded-[3px]"
                          style={{ background: '#8B1A1A', color: '#FAF7F2' }}
                        >
                          {t('register')}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
