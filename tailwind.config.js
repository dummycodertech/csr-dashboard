/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas:   'var(--canvas)',
        surface:  'var(--surface)',
        s2:       'var(--surface-2)',
        border:   'var(--border)',
        'tx-strong': 'var(--text-strong)',
        'tx-body':   'var(--text-body)',
        brand:    'var(--brand)',
        accent:   'var(--accent)',
        positive: 'var(--positive)',
        danger:   'var(--danger)',
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'system-ui', 'sans-serif'],
        mono: ["'IBM Plex Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
}
