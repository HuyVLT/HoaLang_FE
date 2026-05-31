'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, MapPin, ZoomIn, ZoomOut } from 'lucide-react';

// Set the access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface MapboxVillage {
  slug: string;
  name: { vi: string; en: string };
  province: { vi: string; en: string };
  categories: { vi: string[]; en: string[] };
  description: { vi: string; en: string };
  lng: number;
  lat: number;
  coverImage: string;
  isVerified: boolean;
}

interface MapboxMapProps {
  villages: MapboxVillage[];
  selectedVillage: MapboxVillage | null;
  onSelectVillage?: (village: MapboxVillage) => void;
  onExploreVillage?: (village: MapboxVillage) => void;
  interactive?: boolean;
  locale?: 'vi' | 'en';
}

export default function MapboxMap({
  villages,
  selectedVillage,
  onSelectVillage,
  onExploreVillage,
  interactive = true,
  locale = 'vi',
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [slug: string]: mapboxgl.Marker }>({});
  const [mapStyle, setMapStyle] = useState<'outdoors' | 'satellite' | 'light'>('outdoors');
  const [isLoaded, setIsLoaded] = useState(false);

  const hasToken = !!mapboxgl.accessToken;

  const styleUrls = {
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
  };

  // Initialize Map
  useEffect(() => {
    if (!hasToken || !mapContainerRef.current) return;

    // Determine initial center
    let center: [number, number] = [105.9327, 20.9733]; // Default to Bat Trang
    let zoom = 5.5;

    if (selectedVillage) {
      center = [selectedVillage.lng, selectedVillage.lat];
      zoom = 12;
    } else if (villages.length > 0) {
      // Find average coordinates of all villages
      const totalLng = villages.reduce((acc, v) => acc + v.lng, 0);
      const totalLat = villages.reduce((acc, v) => acc + v.lat, 0);
      center = [totalLng / villages.length, totalLat / villages.length];
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrls[mapStyle],
      center: center,
      zoom: zoom,
      scrollZoom: interactive,
      dragPan: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsLoaded(true);
      // Fit to bounds if not focused on one village
      if (!selectedVillage && villages.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        villages.forEach((v) => bounds.extend([v.lng, v.lat]));
        map.fitBounds(bounds, { padding: 80, maxZoom: 10 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapStyle, hasToken]);

  // Update markers
  useEffect(() => {
    if (!hasToken) return;
    const map = mapRef.current;
    if (!map) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    villages.forEach((village) => {
      // Create custom marker HTML
      const el = document.createElement('div');
      el.className = 'custom-marker-container';
      el.style.cursor = 'pointer';

      const isSelected = selectedVillage?.slug === village.slug;

      // React rendering-like structure using vanilla JS for Mapbox marker element
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-10 w-10 rounded-full opacity-60 transition-all ${
            isSelected ? 'animate-ping bg-[#8B1A1A]/30' : 'bg-[#C4952A]/10'
          }"></span>
          <div class="w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-md ${
            isSelected
              ? 'bg-[#8B1A1A] border-[#8B1A1A] text-[#F7F4EF] scale-110 shadow-lg'
              : 'bg-[#F7F4EF] border-[#E2DCD0] text-[#C4952A] hover:border-[#8B1A1A]'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        if (onSelectVillage) {
          onSelectVillage(village);
        }
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([village.lng, village.lat])
        .addTo(map);

      markersRef.current[village.slug] = marker;
    });
  }, [villages, selectedVillage, isLoaded, hasToken]);

  // Center on selected village
  useEffect(() => {
    if (!hasToken) return;
    const map = mapRef.current;
    if (!map || !selectedVillage) return;

    map.flyTo({
      center: [selectedVillage.lng, selectedVillage.lat],
      zoom: 12.5,
      speed: 1.2,
      essential: true,
    });
  }, [selectedVillage, hasToken]);

  // Handle fitBounds when selectedVillage becomes null to restore full view
  useEffect(() => {
    if (!hasToken) return;
    const map = mapRef.current;
    if (!map) return;

    if (!selectedVillage && villages.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      villages.forEach((v) => bounds.extend([v.lng, v.lat]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 10, duration: 1500 });
    }
  }, [selectedVillage, villages, hasToken]);

  const handleZoom = (direction: 'in' | 'out') => {
    const map = mapRef.current;
    if (!map) return;
    if (direction === 'in') {
      map.zoomIn();
    } else {
      map.zoomOut();
    }
  };

  const cycleStyle = () => {
    const styles: Array<'outdoors' | 'satellite' | 'light'> = ['outdoors', 'satellite', 'light'];
    const nextIndex = (styles.indexOf(mapStyle) + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
  };

  if (!hasToken) {
    return (
      <div className="w-full h-full min-h-[400px] relative rounded-sm overflow-hidden border border-stone bg-[#FAF7F2] flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm select-none">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
        
        <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-[#C4952A] bg-cream shadow-sm relative z-10 animate-pulse">
          <MapPin className="w-5 h-5" />
        </div>
        
        <div className="space-y-2 relative z-10 max-w-sm">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C4952A] font-sans block">
            Bản đồ di sản tương tác / Heritage Atlas
          </span>
          <h4 className="font-heading text-lg font-bold italic text-charcoal">
            {locale === 'vi' ? 'Thiết lập Mapbox Token' : 'Mapbox Token Required'}
          </h4>
          <p className="font-sans text-xs text-[#8C8070] leading-relaxed">
            {locale === 'vi' 
              ? 'Nền tảng yêu cầu một Mapbox Access Token hợp lệ để khởi chạy bản đồ di sản tương tác. Vui lòng cấu hình biến NEXT_PUBLIC_MAPBOX_TOKEN trong .env.local.'
              : 'The platform requires a valid Mapbox Access Token to initialize the interactive heritage map. Please configure NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-sm overflow-hidden border border-stone shadow-sm">
      <style>{`
        .mapboxgl-ctrl-logo {
          display: none !important;
        }
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

      {/* Map Control Overlays */}
      {interactive && (
        <>
          {/* Zoom Buttons - dynamically slides up when bottom card is active */}
          <div className={`absolute z-10 flex flex-col gap-2 transition-all duration-300 left-4 ${selectedVillage && onExploreVillage ? 'bottom-28' : 'bottom-4'}`}>
            <button
              onClick={() => handleZoom('in')}
              className="w-9 h-9 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all cursor-pointer"
              title={locale === 'vi' ? 'Thu phóng lại gần' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="w-9 h-9 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all cursor-pointer"
              title={locale === 'vi' ? 'Thu phóng ra xa' : 'Zoom Out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Style Selector */}
          <div className="absolute top-20 right-4 z-10">
            <button
              onClick={cycleStyle}
              className="flex items-center gap-1.5 px-3 py-2 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze rounded-sm text-[10px] font-sans font-semibold uppercase tracking-wider text-charcoal shadow-sm transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {mapStyle === 'outdoors'
                  ? (locale === 'vi' ? 'Địa hình' : 'Outdoors')
                  : mapStyle === 'satellite'
                  ? (locale === 'vi' ? 'Vệ tinh' : 'Satellite')
                  : (locale === 'vi' ? 'Cổ điển' : 'Classic')}
              </span>
            </button>
          </div>
        </>
      )}

      {/* Bottom Horizontal Card Overlay for homepage */}
      {selectedVillage && onExploreVillage && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-cream/95 backdrop-blur-md border border-stone p-3 flex items-center justify-between gap-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 rounded-sm">
          <div className="flex items-center gap-3 text-left">
            <img
              src={selectedVillage.coverImage}
              alt={selectedVillage.name[locale]}
              className="w-12 h-12 object-cover rounded-xs border border-stone/30 shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8C8070] font-sans block">
                {selectedVillage.province[locale]}
              </span>
              <h4 className="font-heading text-sm font-bold italic text-charcoal leading-tight">
                {selectedVillage.name[locale]}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExploreVillage(selectedVillage)}
              className="bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[10px] px-4 py-2.5 rounded-xs hover:brightness-110 shadow-sm transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{locale === 'vi' ? 'Xem website' : 'Visit website'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <button
              onClick={() => onSelectVillage?.(null as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
              className="w-8 h-8 flex items-center justify-center border border-stone/50 hover:border-stone rounded-xs text-ash hover:text-charcoal transition-all shrink-0 cursor-pointer"
              title={locale === 'vi' ? 'Đóng' : 'Close'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Right Attribution Overlay */}
      <div className="absolute bottom-1 right-2 z-10 text-[8px] text-ash/80 pointer-events-none select-none font-sans bg-cream/50 px-1 rounded-xs">
        Mapbox © HoaLang Digital Atlas
      </div>
    </div>
  );
}
