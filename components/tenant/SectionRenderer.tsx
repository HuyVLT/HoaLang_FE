'use client';

import React from 'react';
import { Section } from '@/types/tenant';

// Component imports
import HeroSection from './sections/HeroSection';
import StorySection from './sections/StorySection';
import GallerySection from './sections/GallerySection';
import ProductsSection from './sections/ProductsSection';
import ExperiencesSection from './sections/ExperiencesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import MapSection from './sections/MapSection';

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || !Array.isArray(sections)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} section={section} />;
          case 'story':
            return <StorySection key={section.id} section={section} />;
          case 'gallery':
            return <GallerySection key={section.id} section={section} />;
          case 'products':
            return <ProductsSection key={section.id} section={section} />;
          case 'experiences':
            return <ExperiencesSection key={section.id} section={section} />;
          case 'testimonials':
            return <TestimonialsSection key={section.id} section={section} />;
          case 'cta':
            return <CTASection key={section.id} section={section} />;
          case 'map':
            return <MapSection key={section.id} section={section} />;
          default:
            console.warn(`[SectionRenderer] Unknown section type: ${(section as { type: string }).type}`);
            return null;
        }
      })}
    </div>
  );
}
