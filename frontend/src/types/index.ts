export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProductTemplate {
  id: string;
  name: string;
  description: string | null;
  type: 'PRE_DESIGNED' | 'BLANK';
  basePrice: number | null;
  maxArea: number | null;
  minArea: number | null;
}

export interface Design {
  id: string;
  userId: string | null;
  templateId: string | null;
  type: 'PRE_DESIGNED' | 'BLANK' | 'AI_GENERATED';
  text: string | null;
  fontFamily: string | null;
  width: number;
  height: number;
  material: 'GOLD' | 'SILVER';
  calculatedPrice: number;
  aiPrompt: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface PricingResult {
  width: number;
  height: number;
  material: string;
  area: number;
  price: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string | object;
}
