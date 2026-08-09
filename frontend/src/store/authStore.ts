import { create } from 'zustand';
import api from '../services/api';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (name, email, password, role = 'USER') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
