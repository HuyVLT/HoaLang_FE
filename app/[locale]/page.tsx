'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  ArrowRight, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface VillageMock {
  id: string;
  slug: string;
  name: string;
  province: string;
  image: string;
  descKey: string;
  tag: string;
  primaryPrice: number;
}

export default function LandingPage() {
  const t = useTranslations();
  const [activeTenantTheme, setActiveTenantTheme] = useState<string>('default');
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredVillages: VillageMock[] = [
    {
      id: 'v1',
      slug: 'bat-trang',
      name: 'Lang gom Bat Trang',
      province: 'Ha Noi',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      descKey: 'bat-trang-desc',
      tag: 'Gom su',
      primaryPrice: 250000
    },
    {
      id: 'v2',
      slug: 'van-phuc',
      name: 'Lang lua Van Phuc',
      province: 'Ha Noi',
      image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      descKey: 'van-phuc-desc',
      tag: 'Det lua',
      primaryPrice: 450000
    },
    {
      id: 'v3',
      slug: 'dong-ho',
      name: 'Lang tranh Dong Ho',
      province: 'Bac Ninh',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
      descKey: 'dong-ho-desc',
      tag: 'Tranh dan gian',
      primaryPrice: 150000
    }
  ];

  const handleAddToCart = (village: VillageMock, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: village.id,
      name: `San pham luu niem ${village.name}`,
      price: village.primaryPrice,
      image: village.image,
      villageName: village.name
    });
    toast.success(`Da them san pham tu ${village.name} vao gio hang`);
  };

  const getTenantClass = () => {
    switch (activeTenantTheme) {
      case 'ceramic': return 'tenant-ceramic';
      case 'silk': return 'tenant-silk';
      case 'lacquer': return 'tenant-lacquer';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getTenantClass()}`}>
      
      {/* Floating Dynamic Tenant Theme Customizer for Testing */}
      {mounted && (
        <div className="fixed bottom-6 left-6 z-40 bg-background/95 backdrop-blur border border-border p-4 rounded-xl shadow-lg max-w-xs font-sans">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tenant Customization
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">
            {t('common.tenantText')}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveTenantTheme('default')}
              className={`text-[10px] py-1 px-2 rounded border transition-colors text-left ${
                activeTenantTheme === 'default'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
              }`}
            >
              Default (Moss)
            </button>
            <button
              onClick={() => setActiveTenantTheme('ceramic')}
              className={`text-[10px] py-1 px-2 rounded border transition-colors text-left ${
                activeTenantTheme === 'ceramic'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
              }`}
            >
              Bat Trang (Clay)
            </button>
            <button
              onClick={() => setActiveTenantTheme('silk')}
              className={`text-[10px] py-1 px-2 rounded border transition-colors text-left ${
                activeTenantTheme === 'silk'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
              }`}
            >
              Van Phuc (Silk)
            </button>
            <button
              onClick={() => setActiveTenantTheme('lacquer')}
              className={`text-[10px] py-1 px-2 rounded border transition-colors text-left ${
                activeTenantTheme === 'lacquer'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
              }`}
            >
              Lacquer (Deep)
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Nen tang du lich van hoa Viet Nam</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15]">
                {t('hero.title')}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/villages">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/95 transition-all flex items-center gap-2 group text-sm"
                  >
                    <span>{t('hero.ctaExplore')}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/itinerary">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-background text-foreground border border-border font-semibold rounded-lg hover:bg-muted/50 transition-all text-sm"
                  >
                    {t('hero.ctaItinerary')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative"
            >
              {/* Decorative background geometry */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-accent/25 to-primary/15 blur-2xl z-0" />
              
              <div className="relative z-10 overflow-hidden rounded-2xl border-4 border-background shadow-2xl aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Vietnamese pottery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Villages Section */}
      <section className="py-20 bg-muted/40 border-t border-b border-border bg-grain-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              {t('featured.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVillages.map((village, idx) => (
              <motion.div
                key={village.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group flex flex-col overflow-hidden bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={village.image}
                    alt={village.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                    {village.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {village.province}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {village.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Lang truyen thong lau doi mang dam net tinh hoa van hoa dat Viet voi cac nghe nhan tay nghe cao tu thoi xua.
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary">
                      {village.primaryPrice.toLocaleString('vi-VN')} VND
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => handleAddToCart(village, e)}
                        className="h-8 w-8 p-0"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                      <Link href={`/villages/${village.slug}`}>
                        <Button size="sm" className="h-8 gap-1 bg-primary text-primary-foreground hover:bg-primary/95 text-xs">
                          <span>{t('common.viewDetail')}</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              {t('howItWorks.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Map,
                title: t('howItWorks.step1Title'),
                desc: t('howItWorks.step1Desc')
              },
              {
                icon: Sparkles,
                title: t('howItWorks.step2Title'),
                desc: t('howItWorks.step2Desc')
              },
              {
                icon: BookOpen,
                title: t('howItWorks.step3Title'),
                desc: t('howItWorks.step3Desc')
              },
              {
                icon: ShoppingBag,
                title: t('howItWorks.step4Title'),
                desc: t('howItWorks.step4Desc')
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl border border-border/80 shadow-sm relative group"
              >
                <div className="absolute top-4 left-4 text-xs font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                  0{idx + 1}
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-grain">
        <div className="absolute inset-0 bg-primary/5 z-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-secondary text-secondary-foreground rounded-2xl p-8 sm:p-12 lg:p-16 border border-secondary/10 shadow-xl space-y-6"
          >
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">
              {t('cta.title')}
            </h2>
            <p className="text-sm sm:text-base text-secondary-foreground/80 leading-relaxed max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/itinerary">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-6 rounded-lg gap-2 text-sm shadow-md">
                  <span>{t('cta.button')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
