import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './i18n/**/*.{ts,tsx}',
    './messages/*.json'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0e',
        foreground: '#f8f5ee',
        border: 'rgba(255,255,255,0.12)',
        card: 'rgba(18,18,22,0.85)',
        gold: '#c9a86a',
        muted: '#b9b4a7',
        accent: '#17171d'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,0.25)',
        panel: '0 14px 48px rgba(0,0,0,0.32)'
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
