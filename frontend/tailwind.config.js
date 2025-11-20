/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0d1117',
          text: '#c9d1d9',
          green: '#238636',
          blue: '#58a6ff',
          border: '#30363d',
          header: '#161b22'
        }
      }
    },
  },
  plugins: [],
}
