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

const SECTION_MAP: Record<string, React.ComponentType<{ section: Section }>> = {
  hero: HeroSection,
  story: StorySection,
  gallery: GallerySection,
  products: ProductsSection,
  experiences: ExperiencesSection,
  testimonials: TestimonialsSection,
  cta: CTASection,
  map: MapSection,
};

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
        const Component = SECTION_MAP[section.type];
        if (!Component) {
          console.warn(`[SectionRenderer] Unknown section type: ${section.type}`);
          return null;
        }

        return <Component key={section.id} section={section} />;
      })}
    </div>
  );
}
