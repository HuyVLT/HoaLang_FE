'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapSection as MapSectionType } from '@/types/tenant';
import { SectionLabel, LocaleText } from '@/components/shared';
import { fadeUp, stagger } from './motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Configure token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MapSection({ section }: { section: MapSectionType }) {
  const { heading, coordinates, address, phone, hours } = section;
  const [lng, lat] = coordinates;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hasMapboxToken] = useState(!!mapboxgl.accessToken);

  // Static maps fallback / embedding beautiful OpenStreetMap iframe or customizable mock
  const mapIframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  useEffect(() => {
    if (!hasMapboxToken || !mapContainerRef.current) return;

    // Create the Mapbox map focused on the village location
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [lng, lat],
      zoom: 13.5,
      attributionControl: false,
    });

    mapRef.current = map;

    // Create custom styled lacquer red marker element
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.cursor = 'pointer';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-8 w-8 rounded-full bg-[#8B1A1A]/35 animate-ping"></span>
        <div class="w-8 h-8 rounded-full border border-[#8B1A1A] bg-[#8B1A1A] text-[#FAF7F2] flex items-center justify-center shadow-lg transform scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `;

    // Instantiate and add the marker to the map
    new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lng, lat, hasMapboxToken]);

  const handleZoom = (direction: 'in' | 'out') => {
    const map = mapRef.current;
    if (!map) return;
    if (direction === 'in') {
      map.zoomIn();
    } else {
      map.zoomOut();
    }
  };

  return (
    <section
      id="map-location"
      className="bg-parchment py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
        >
          {/* Info Card — Column 1 to 5 */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left bg-cream border border-stone rounded-sm p-8 md:p-10 select-none shadow-sm h-full">
            <div className="space-y-8">
              <div>
                <motion.div variants={fadeUp} className="mb-4">
                  <SectionLabel label="Tìm đường ghé thăm / Location" />
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  className="font-heading text-charcoal italic"
                  style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: 1.2 }}
                >
                  <LocaleText content={heading} />
                </motion.h2>
              </div>

              {/* Information listing */}
              <div className="space-y-6 pt-4">
                {/* Address block */}
                <motion.div variants={fadeUp} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-semibold text-charcoal text-[13px] uppercase tracking-wider mb-1">
                      Địa chỉ / Address
                    </h4>
                    <p className="font-sans text-ash text-sm font-light leading-relaxed">
                      <LocaleText content={address} />
                    </p>
                  </div>
                </motion.div>

                {/* Telephone block */}
                {phone && (
                  <motion.div variants={fadeUp} className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans font-semibold text-charcoal text-[13px] uppercase tracking-wider mb-1">
                        Điện thoại / Hotline
                      </h4>
                      <a href={`tel:${phone}`} className="font-sans text-ash text-sm font-light hover:text-primary transition-colors">
                        {phone}
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Operating hours block */}
                {hours && (
                  <motion.div variants={fadeUp} className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans font-semibold text-charcoal text-[13px] uppercase tracking-wider mb-1">
                        Giờ mở cửa / Opening Hours
                      </h4>
                      <p className="font-sans text-ash text-sm font-light">
                        <LocaleText content={hours} />
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Google maps redirection button */}
            <motion.div variants={fadeUp} className="pt-8">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-[0.12em] text-[10px] px-6 py-3 rounded-sm hover:brightness-110 shadow-sm transition-all"
              >
                <Compass className="w-4 h-4 text-accent" />
                <span>Chỉ đường / Get Directions</span>
              </a>
            </motion.div>
          </div>

          {/* Interactive Map Visualizer — Column 6 to 12 */}
          <div className="lg:col-span-7 relative h-[350px] lg:h-auto min-h-[400px]">
            <motion.div
              variants={fadeUp}
              className="absolute inset-0 rounded-sm overflow-hidden border border-stone shadow-sm bg-stone/20"
            >
              {hasMapboxToken ? (
                <div className="w-full h-full relative">
                  <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
                  {/* Zoom controls */}
                  <div className="absolute z-10 flex flex-col gap-2 bottom-4 left-4">
                    <button
                      onClick={() => handleZoom('in')}
                      className="w-8 h-8 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleZoom('out')}
                      className="w-8 h-8 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Custom attribution */}
                  <div className="absolute bottom-1 right-2 z-10 text-[8px] text-ash/80 pointer-events-none select-none font-sans bg-cream/50 px-1 rounded-xs">
                    Mapbox © HoaLang
                  </div>
                </div>
              ) : (
                /* Interactive OpenStreetMap Iframe for pristine mapping */
                <iframe
                  title="Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={mapIframeUrl}
                  className="filter brightness-[0.95] contrast-[1.05] grayscale-[20%]"
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
