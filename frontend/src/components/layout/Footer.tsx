import { Gem } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-surface-100/50 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gem size={20} className="text-brand-gold" />
              <span className="font-display text-lg font-bold text-gradient-gold">Hany Jewelry</span>
            </div>
            <p className="text-white/40 leading-relaxed">
              Premium custom nameplate & jewelry design studio. Handcrafted perfection in gold and silver.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-white/40">
              <li><a href="/customizer" className="hover:text-brand-gold transition-colors">Design Studio</a></li>
              <li><a href="/gallery" className="hover:text-brand-gold transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 mb-3">Contact</h4>
            <ul className="space-y-2 text-white/40">
              <li>support@hanyjewelry.com</li>
              <li>WhatsApp: +20 100 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} Hany Jewelry. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
