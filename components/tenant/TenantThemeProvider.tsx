'use client';

import React, { createContext, useContext } from 'react';
import { ThemeConfig } from '@/types/tenant';

interface TenantThemeContextType {
  theme: ThemeConfig;
}

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(undefined);

export const useTenantTheme = () => {
  const context = useContext(TenantThemeContext);
  if (!context) {
    throw new Error('useTenantTheme must be used within a TenantThemeProvider');
  }
  return context;
};

interface TenantThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export default function TenantThemeProvider({
  theme,
  children,
}: TenantThemeProviderProps) {
  // Map friendly font names to their CSS variable values loaded in root layout
  const fontHeadingMap: Record<string, string> = {
    'Cormorant Garamond': 'var(--font-heading), Georgia, serif',
    'Playfair Display': 'var(--font-playfair), Georgia, serif',
  };

  const fontBodyMap: Record<string, string> = {
    'Be Vietnam Pro': 'var(--font-sans), sans-serif',
  };

  const dynamicStyles = {
    // Standard variables override
    '--primary': theme.primaryColor,
    '--accent': theme.accentColor,
    '--primary-foreground': '#FAF7F2', // Cream
    '--accent-foreground': '#1A1208', // Ink

    // Core Brand overrides to seamlessly skin shared components
    '--color-lacquer': theme.primaryColor,
    '--color-gold': theme.accentColor,

    // Typographical variables override
    '--font-heading': fontHeadingMap[theme.fontHeading] || fontHeadingMap['Cormorant Garamond'],
    '--font-sans': fontBodyMap[theme.fontBody] || fontBodyMap['Be Vietnam Pro'],
  } as React.CSSProperties;

  return (
    <TenantThemeContext.Provider value={{ theme }}>
      <div style={dynamicStyles} className="min-h-screen bg-parchment text-ink antialiased font-sans">
        {children}
      </div>
    </TenantThemeContext.Provider>
  );
}
