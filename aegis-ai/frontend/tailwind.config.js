/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07111A',
        sidebar: '#09151E',
        card: {
          DEFAULT: '#0D1B24',
          subtle: '#101F29',
        },
        border: {
          DEFAULT: '#1D3440',
        },
        primary: {
          DEFAULT: '#34D399', // Emerald/Teal
          hover: '#059669',
          light: '#6EE7B7',
        },
        teal: {
          accent: '#5EEAD4',
          cyan: '#67E8F9',
        },
        gold: {
          DEFAULT: '#E8D5A3',
          light: '#F3E8C9',
          muted: '#C4B282',
        },
        accent: {
          blue: '#38BDF8',
          emerald: '#34D399',
          yellow: '#FACC15',
          orange: '#FB923C',
          red: '#F87171',
        },
        status: {
          healthy: '#34D399',
          warning: '#FACC15',
          high: '#FB923C',
          critical: '#F87171',
        },
        text: {
          main: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
