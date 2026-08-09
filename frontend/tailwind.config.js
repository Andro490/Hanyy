/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        arabic: ['Noto Kufi Arabic', 'sans-serif'],
      },
      colors: {
        brand: {
          gold: '#D4AF37',
          'gold-light': '#F5E6A3',
          'gold-dark': '#B8960C',
          silver: '#C0C0C0',
          'silver-light': '#E8E8E8',
        },
        surface: {
          50: '#f8fafc',
          100: '#0f0f17',
          200: '#13131d',
          300: '#1a1a2e',
          400: '#22223a',
          500: '#2a2a45',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)',
        'gradient-silver': 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
