'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tenant') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-secondary text-secondary-foreground border-t border-secondary/15 font-sans">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Intro Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-accent" />
              <span className="font-heading text-2xl font-bold tracking-wide text-accent">
                HoaLang
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Nen tang ket noi du lich va gin giu gia tri di san lang nghe truyen thong Viet Nam. Hanh trinh gin giu hon cot dan toc Viet.
            </p>
          </div>

          {/* Site Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              Kham Pha
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm hover:text-accent transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm hover:text-accent transition-colors">
                  {t('map')}
                </Link>
              </li>
              <li>
                <Link href="/villages" className="text-sm hover:text-accent transition-colors">
                  {t('villages')}
                </Link>
              </li>
              <li>
                <Link href="/itinerary" className="text-sm hover:text-accent transition-colors">
                  {t('itinerary')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace & Experience */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              San Pham & Workshop
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm hover:text-accent transition-colors">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link href="/experience" className="text-sm hover:text-accent transition-colors">
                  {t('experience')}
                </Link>
              </li>
              <li>
                <a href="#rules" className="text-sm hover:text-accent transition-colors">
                  Dieu khoan su dung
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              Lien He
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-1 text-accent shrink-0" />
                <span className="text-sm text-secondary-foreground/80 leading-relaxed">
                  Ha Noi, Viet Nam
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-secondary-foreground/80">
                  +84 123 456 789
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-secondary-foreground/80">
                  contact@hoalang.vn
                </span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary-foreground/10 my-8" />

        {/* Copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-foreground/70">
            &copy; {new Date().getFullYear()} HoaLang Platform. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-secondary-foreground/60">
            <span>Hệ thống Quản trị di sản Làng nghề</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
