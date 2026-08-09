import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.PROD
  ? 'https://hanyy-production-166a.up.railway.app/api'
  : '/api';

export const GalleryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err: any) {
      console.error('[Gallery]', err);
      setError('Failed to load gallery. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6"
        >
          <Gem size={16} /> Premium Collection
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          Our <span className="text-gradient-gold">Gallery</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 max-w-2xl mx-auto"
        >
          Explore our latest custom jewelry designs and find inspiration for your next masterpiece.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-white/50">
          <AlertCircle size={40} className="text-red-400" />
          <p>{error}</p>
          <button onClick={fetchGallery} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.08, 0.4) }}
              className="glass-card overflow-hidden group cursor-pointer hover:border-brand-gold/30 transition-colors"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x300?text=Image+not+available';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                  {item.price && (
                    <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 shrink-0 ml-2">
                      {item.price}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-white/60 text-sm mb-5 leading-relaxed">{item.description}</p>
                )}
                <Link
                  to="/customizer"
                  className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-white transition-colors group/link"
                >
                  Customize Similar
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-24 text-white/40 space-y-3">
              <Gem size={40} className="mx-auto opacity-30" />
              <p className="text-lg">No items in the gallery yet.</p>
              <p className="text-sm">Check back later for premium designs!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
