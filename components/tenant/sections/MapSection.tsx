'use client';

import React from 'react';
import { MapPin, Phone, Clock, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapSection as MapSectionType } from '@/types/tenant';
import { SectionLabel, LocaleText } from '@/components/shared';
import { fadeUp, stagger } from './motion';

export default function MapSection({ section }: { section: MapSectionType }) {
  const { heading, coordinates, address, phone, hours } = section;
  const [lng, lat] = coordinates;

  // Static maps fallback / embedding beautiful OpenStreetMap iframe or customizable mock
  const mapIframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

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
              {/* Interactive OpenStreetMap Iframe for pristine mapping */}
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
