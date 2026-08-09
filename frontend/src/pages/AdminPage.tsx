import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Shield, Plus, Settings, Trash2, Image as ImageIcon } from 'lucide-react';

export const AdminPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [pricing, setPricing] = useState({ baseGoldPrice: 200, baseSilverPrice: 80, manufacturingFee: 1.3 });
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', imageUrl: '', price: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
    } else if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [pricingRes, galleryRes] = await Promise.all([
        api.get('/admin/pricing'),
        api.get('/admin/gallery')
      ]);
      if (pricingRes.data.data) setPricing(pricingRes.data.data);
      if (galleryRes.data.data) setGalleryItems(galleryRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await api.post('/admin/pricing', pricing);
      setMessage('Pricing updated successfully!');
    } catch (err) {
      setMessage('Failed to update pricing');
    }
    setIsLoading(false);
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.post('/admin/gallery', newItem);
      setGalleryItems([res.data.data, ...galleryItems]);
      setNewItem({ title: '', description: '', imageUrl: '', price: '' });
      setMessage('Item added to gallery!');
    } catch (err) {
      setMessage('Failed to add item');
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      setGalleryItems(galleryItems.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={32} className="text-brand-gold" />
        <h1 className="text-4xl font-display font-bold text-white">Admin Dashboard</h1>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Control */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="text-brand-gold" />
            <h2 className="text-2xl font-bold">Pricing Variables</h2>
          </div>
          <form onSubmit={handleUpdatePricing} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Base Gold Price (per cm²)</label>
              <input type="number" step="0.01" value={pricing.baseGoldPrice} onChange={e => setPricing({ ...pricing, baseGoldPrice: parseFloat(e.target.value) })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Base Silver Price (per cm²)</label>
              <input type="number" step="0.01" value={pricing.baseSilverPrice} onChange={e => setPricing({ ...pricing, baseSilverPrice: parseFloat(e.target.value) })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Manufacturing Fee Multiplier</label>
              <input type="number" step="0.01" value={pricing.manufacturingFee} onChange={e => setPricing({ ...pricing, manufacturingFee: parseFloat(e.target.value) })} className="input-dark w-full" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">Save Pricing</button>
          </form>
        </motion.div>

        {/* Add Gallery Item */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="text-brand-gold" />
            <h2 className="text-2xl font-bold">Add to Gallery</h2>
          </div>
          <form onSubmit={handleAddGalleryItem} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Title</label>
              <input type="text" required value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Image URL (Direct link)</label>
              <input type="url" required value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} className="input-dark w-full" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Price / Range (e.g. "1200 EGP" or "800-1500 EGP")</label>
              <input type="text" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="input-dark w-full" placeholder="e.g. 1200 EGP or 800-1500 EGP" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">Add Item</button>
          </form>
        </motion.div>
      </div>

      {/* Gallery List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="text-brand-gold" />
          <h2 className="text-2xl font-bold">Manage Gallery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-3">
                <h3 className="font-bold">{item.title}</h3>
                {item.price && (
                  <span className="inline-block mt-1 text-xs font-semibold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1">
                    {item.price}
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {galleryItems.length === 0 && (
            <p className="text-white/40 col-span-full">No gallery items yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
