import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const GalleryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        setItems(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
          <Gem size={16} /> Premium Collection
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Our <span className="text-gradient-gold">Gallery</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 max-w-2xl mx-auto">
          Explore our latest custom jewelry designs and find inspiration for your next masterpiece.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                  {item.price && <span className="text-brand-gold font-bold">${item.price}</span>}
                </div>
                {item.description && <p className="text-white/60 text-sm mb-6">{item.description}</p>}
                
                <Link to="/customizer" className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-white transition-colors">
                  Customize Similar <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-white/40">
              No items in the gallery yet. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
