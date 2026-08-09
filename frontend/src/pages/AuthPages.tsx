import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Gem } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch { /* error handled by store */ }
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
