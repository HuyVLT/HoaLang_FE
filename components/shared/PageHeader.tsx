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
  /**
   * Header theme variant
   */
  variant?: 'dark' | 'light';
}

/**
 * PageHeader - A premium, full-width editorial page header.
 * Supports charcoal background ('dark') and parchment background ('light') variants.
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  className,
  variant = 'dark',
}: PageHeaderProps) {
  const isLight = variant === 'light';

  return (
    <section
      className={cn(
        "w-full relative overflow-hidden py-16 sm:py-20 px-6 sm:px-12 md:px-20 border-b bg-grain",
        isLight ? "bg-parchment border-stone/30" : "bg-charcoal text-cream border-stone/10",
        className
      )}
    >
      <div className="max-w-max-content mx-auto space-y-4 relative z-10 text-left">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-2 text-[12px] font-medium tracking-[0.1em] text-ash uppercase font-sans select-none">
            <Link 
              href="/" 
              className={cn(
                "transition-colors", 
                isLight ? "hover:text-lacquer text-ash" : "hover:text-gold text-stone/80"
              )}
            >
              Home
            </Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <span className={isLight ? "text-stone/50" : "text-stone/30"}>/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className={cn(
                    "font-semibold normal-case truncate max-w-[150px]", 
                    isLight ? "text-charcoal" : "text-stone"
                  )}>
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className={cn(
                      "transition-colors", 
                      isLight ? "hover:text-lacquer text-ash" : "hover:text-gold text-stone/80"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Page Title */}
        <h1 className={cn(
          "font-heading text-4xl sm:text-5xl lg:text-[56px] font-light leading-tight italic tracking-tight",
          isLight ? "text-lacquer" : "text-cream"
        )}>
          {title}
        </h1>

        {/* Page Subtitle */}
        {subtitle && (
          <p className={cn(
            "font-sans text-sm sm:text-base max-w-xl leading-relaxed font-light",
            isLight ? "text-bronze" : "text-stone/85"
          )}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative organic gold trace on the right side */}
      <div className={cn(
        "absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none",
        isLight ? "bg-gradient-to-l from-gold/3 to-transparent" : "bg-gradient-to-l from-gold/5 to-transparent"
      )} />
    </section>
  );
}

export { PageHeader };
