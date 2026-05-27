'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag, LogOut, Compass } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/map', label: t('map') },
    { href: '/villages', label: t('villages') },
    { href: '/itinerary', label: t('itinerary') },
    { href: '/shop', label: t('shop') },
    { href: '/experience', label: t('experience') },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-2 group">
          <Compass className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-heading text-xl font-bold tracking-wide text-primary">
            HoaLang
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-sans">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary font-semibold border-b-2 border-primary pb-1 mt-1' : 'text-foreground/75'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* Cart Icon Link */}
          <Link href="/shop" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground ring-1 ring-background animate-pulse">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                  {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 gap-1 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="h-8 text-foreground/80 hover:text-primary">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="h-8 bg-primary hover:bg-primary/95 text-primary-foreground">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Drawer Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-foreground" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-background w-72 p-6 font-sans">
                <div className="flex flex-col gap-6 mt-4">
                  <Link href="/" className="font-heading text-2xl font-bold text-primary mb-4 block">
                    HoaLang
                  </Link>

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`text-base font-medium transition-colors hover:text-primary ${
                            isActive ? 'text-primary font-semibold' : 'text-foreground/80'
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  <hr className="border-border my-2" />

                  {/* Auth Actions */}
                  <div className="flex flex-col gap-3">
                    {mounted && isAuthenticated ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground block py-1">
                          {user?.name || user?.email}
                        </span>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full gap-2 justify-center border-primary/20 text-primary"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('logout')}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link href="/auth/login" className="w-full">
                          <Button variant="outline" className="w-full">
                            {t('login')}
                          </Button>
                        </Link>
                        <Link href="/auth/register" className="w-full">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/95">
                            {t('register')}
                          </Button>
                        </Link>
                      </div>
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
