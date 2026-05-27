'use client';

import React from 'react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PageHeaderProps {
  /**
   * Main editorial title
   */
  title: string;
  /**
   * Optional descriptive subtitle
   */
  subtitle?: string;
  /**
   * Optional breadcrumb navigation array
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * PageHeader - A premium, full-width editorial page header with charcoal background.
 * Perfect for introducing inner pages like Shop, Villages list, or Experiences.
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "w-full bg-charcoal text-cream relative overflow-hidden py-16 sm:py-20 px-6 sm:px-12 md:px-20 border-b border-stone/10 bg-grain",
        className
      )}
    >
      <div className="max-w-max-content mx-auto space-y-4 relative z-10 text-left">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-2 text-[12px] font-medium tracking-[0.1em] text-ash uppercase font-sans select-none">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <span className="text-stone/30">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-stone font-semibold normal-case truncate max-w-[150px]">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Page Title */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-light leading-tight italic text-cream tracking-tight">
          {title}
        </h1>

        {/* Page Subtitle */}
        {subtitle && (
          <p className="font-sans text-sm sm:text-base text-stone/85 max-w-xl leading-relaxed font-light">
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative organic gold trace on the right side */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
    </section>
  );
}

export { PageHeader };
