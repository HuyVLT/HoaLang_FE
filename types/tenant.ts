export type MultilingualText = {
  vi: string;
  en?: string;
  zh?: string;
  ja?: string;
  ko?: string;
  [locale: string]: string | undefined;
};

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logo: string;
  favicon: string;
}

export interface BaseSection {
  id: string;
  type: string;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  title: MultilingualText;
  subtitle: MultilingualText;
  backgroundImage: string;
  primaryCta: {
    label: MultilingualText;
    link: string;
  };
  secondaryCta?: {
    label: MultilingualText;
    link: string;
  };
}

export interface StorySection extends BaseSection {
  type: 'story';
  heading: MultilingualText;
  storyText: MultilingualText;
  artisanName?: MultilingualText;
  artisanTitle?: MultilingualText;
  image: string;
  quote?: MultilingualText;
}

export interface GallerySection extends BaseSection {
  type: 'gallery';
  heading: MultilingualText;
  subheading?: MultilingualText;
  images: {
    url: string;
    caption?: MultilingualText;
  }[];
}

export interface ProductsSection extends BaseSection {
  type: 'products';
  heading: MultilingualText;
  subheading?: MultilingualText;
  productIds?: string[]; // Optional specific product overrides
}

export interface ExperienceItem {
  title: MultilingualText;
  description: MultilingualText;
  image: string;
  price: number;
  duration: string;
}

export interface ExperiencesSection extends BaseSection {
  type: 'experiences';
  heading: MultilingualText;
  subheading?: MultilingualText;
  items?: ExperienceItem[]; // Pre-defined custom workshops
}

export interface TestimonialItem {
  quote: MultilingualText;
  author: string;
  role?: string;
  avatar?: string;
}

export interface TestimonialsSection extends BaseSection {
  type: 'testimonials';
  heading: MultilingualText;
  items: TestimonialItem[];
}

export interface CTASection extends BaseSection {
  type: 'cta';
  heading: MultilingualText;
  description: MultilingualText;
  buttonText: MultilingualText;
  buttonLink: string;
  backgroundImage?: string;
  placeholderText?: MultilingualText;
  successTitle?: MultilingualText;
  successDesc?: MultilingualText;
}

export interface MapSection extends BaseSection {
  type: 'map';
  heading: MultilingualText;
  coordinates: [number, number]; // [longitude, latitude]
  address: MultilingualText;
  phone?: string;
  hours?: MultilingualText;
}

export type Section =
  | HeroSection
  | StorySection
  | GallerySection
  | ProductsSection
  | ExperiencesSection
  | TestimonialsSection
  | CTASection
  | MapSection;

export interface PageConfig {
  tenantId: string; // The tenant slug e.g. "bat-trang"
  templateId: string; // e.g. "pottery-template", "silk-template"
  theme: ThemeConfig;
  sections: Section[];
  published?: boolean;
  updatedAt?: Date;
}
