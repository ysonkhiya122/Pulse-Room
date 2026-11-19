/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05080F',
        panel: '#0B1220',
        'panel-subtle': '#0F182B',
        border: '#1E2A44',
        'border-active': '#2E4168',
        text: '#E6EDF7',
        muted: '#9DB0CF',
        accent: {
          DEFAULT: '#38E8D0',
          hover: '#2CC2AD',
          glow: 'rgba(56, 232, 208, 0.25)',
        },
        topic: {
          calamity: '#FF6B6B',
          fire: '#FFB454',
          storm: '#5BC0FF',
          wildlife: '#7CE38B',
          sports: '#A78BFA',
          news: '#38E8D0',
          entertainment: '#F472B6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        panel: '16px',
        chip: '9999px',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'orb-breathe': 'orbBreathe 3s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbBreathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(56, 232, 208, 0.35)' },
          '50%': { transform: 'scale(1.06)', boxShadow: '0 0 35px rgba(56, 232, 208, 0.65)' },
        },
      },
    },
  },
  plugins: [],
};
