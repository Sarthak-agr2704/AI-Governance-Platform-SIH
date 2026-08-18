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
        background: '#0b0f19',
        surface: {
          DEFAULT: '#111827',
          card: '#1e293b',
          hover: '#334155',
          border: '#1f293d',
        },
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
          indigo: '#6366f1',
        },
        status: {
          healthy: '#22c55e',
          warning: '#f59e0b',
          critical: '#ef4444',
          info: '#3b82f6',
        },
        text: {
          main: '#f9fafb',
          muted: '#9ca3af',
          dim: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
