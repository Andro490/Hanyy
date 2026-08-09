import { create } from 'zustand';

interface CustomizerState {
  type: 'PRE_DESIGNED' | 'BLANK' | 'AI_GENERATED';
  text: string;
  fontFamily: string;
  width: number;
  height: number;
  material: 'GOLD' | 'SILVER';
  textColor: string;
  aiPrompt: string;
  price: number;
  templateStyle: string;
  autoFit: boolean;
  textCurve: 'none' | 'up' | 'down';
  fontSizeScale: number;
  
  // Actions
  setType: (type: 'PRE_DESIGNED' | 'BLANK' | 'AI_GENERATED') => void;
  setText: (text: string) => void;
  setFontFamily: (font: string) => void;
  setDimensions: (width: number, height: number) => void;
  setMaterial: (material: 'GOLD' | 'SILVER') => void;
  setTextColor: (color: string) => void;
  setPrice: (price: number) => void;
  setAIPrompt: (prompt: string) => void;
  setTemplateStyle: (style: string) => void;
  setAutoFit: (autoFit: boolean) => void;
  setTextCurve: (curve: 'none' | 'up' | 'down') => void;
  setFontSizeScale: (scale: number) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  type: 'PRE_DESIGNED',
  text: '',
  fontFamily: "'Aref Ruqaa', serif",
  width: 5, // Default 5cm
  height: 2, // Default 2cm
  material: 'GOLD',
  textColor: '#D4AF37', // Default to Gold color
  aiPrompt: '',
  price: 0,
  templateStyle: 'crown',
  autoFit: false,
  textCurve: 'none',
  fontSizeScale: 1,
  
  setType: (type) => set({ type }),
  setText: (text) => set({ text }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setDimensions: (width, height) => set({ width, height }),
  setMaterial: (material) => set({ material, textColor: material === 'GOLD' ? '#D4AF37' : '#E8E8E8' }),
  setTextColor: (textColor) => set({ textColor }),
  setPrice: (price) => set({ price }),
  setAIPrompt: (aiPrompt) => set({ aiPrompt }),
  setTemplateStyle: (templateStyle) => set({ templateStyle }),
  setAutoFit: (autoFit) => set({ autoFit }),
  setTextCurve: (textCurve) => set({ textCurve }),
  setFontSizeScale: (fontSizeScale) => set({ fontSizeScale }),
}));
