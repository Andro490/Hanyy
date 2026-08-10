import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Gem } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.PROD
  ? 'https://hanyy-production-166a.up.railway.app/api'
  : '/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, checkAuth, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Handle redirect back from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_auth') === 'success') {
      checkAuth().then(() => navigate('/'));
    }
    if (params.get('error') === 'google_failed') {
      // show error via store or alert
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch { /* error handled by store */ }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8 gold-glow">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Gem size={28} className="text-brand-gold" />
            <span className="font-display text-2xl font-bold text-gradient-gold">Welcome Back</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6" onClick={clearError}>
              {typeof error === 'string' ? error : 'Authentication failed'}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all mb-4 text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-dark" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><Lock size={14} /> Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-dark pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account? <Link to="/register" className="text-brand-gold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch { /* error handled by store */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8 gold-glow">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Gem size={28} className="text-brand-gold" />
            <span className="font-display text-2xl font-bold text-gradient-gold">Create Account</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6" onClick={clearError}>
              {typeof error === 'string' ? error : 'Registration failed'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><User size={14} /> Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-dark" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-dark" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><Lock size={14} /> Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="input-dark pr-10" placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 flex items-center gap-1.5"><User size={14} /> Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-dark w-full appearance-none">
                <option value="USER">Guest / User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account? <Link to="/login" className="text-brand-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
