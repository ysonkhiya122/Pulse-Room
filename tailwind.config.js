/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0D14',
        panel: {
          DEFAULT: '#111622',
          subtle: '#161D2E',
          hover: '#1C2438',
        },
        border: {
          DEFAULT: '#1F2636',
          active: '#2E3A52',
          focus: '#38BDF8',
        },
        text: {
          DEFAULT: '#F1F5F9',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        accent: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          muted: 'rgba(6, 182, 212, 0.12)',
          border: 'rgba(6, 182, 212, 0.35)',
        },
        topic: {
          calamity: '#F43F5E',
          fire: '#F97316',
          storm: '#38BDF8',
          wildlife: '#10B981',
          sports: '#818CF8',
          news: '#06B6D4',
          aqi: '#A855F7',
          entertainment: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        panel: '14px',
        chip: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
        elevated: '0 4px 12px 0 rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        popover: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
