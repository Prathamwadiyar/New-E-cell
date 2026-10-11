import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

const ProfileGallery = ({ gallery = [] }) => {
  const [activeMedia, setActiveMedia] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-16 border-b border-white/[0.08]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-light block mb-1">
            Section 03 // Visual Archive
          </span>
          <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            Competition & Project Moments
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gallery.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            onClick={() => setActiveMedia(item)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 cursor-pointer"
          >
            <img
              src={item.url}
              alt={item.caption || 'Event image'}
              className="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white block">
                <ZoomIn className="w-3.5 h-3.5" />
              </span>
            </div>

            {item.caption && (
              <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-white/90 line-clamp-1">
                {item.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveMedia(null)}
            />
            <div className="relative max-w-4xl max-h-[90vh] z-10 p-2">
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activeMedia.url}
                alt={activeMedia.caption || 'Expanded media'}
                className="max-h-[80vh] w-auto mx-auto rounded-xl border border-white/10 object-contain shadow-2xl"
              />
              {activeMedia.caption && (
                <p className="text-center text-sm font-mono text-white/80 mt-3">
                  {activeMedia.caption}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProfileGallery;
