import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gem, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Design Studio', href: '/customizer' },
  { label: 'Gallery', href: '/gallery' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-100/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-gold/30 transition-shadow">
              <Gem size={20} className="text-black" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-gold">Hany</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / User */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm text-white/60 hover:text-white flex items-center gap-1.5 transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <User size={16} /> {user?.name}
                </div>
                <button onClick={() => logout()} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm !px-4 !py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white/80">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-200 border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.href ? 'bg-white/10 text-white' : 'text-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-3 mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm text-brand-gold text-left font-bold flex items-center gap-2">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setIsOpen(false); }} className="px-4 py-3 text-sm text-red-400 text-left flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm text-white/80">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
