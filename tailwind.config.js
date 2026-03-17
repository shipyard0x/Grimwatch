/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080C0A',
        'accent-green': '#00FFA3',
        'accent-amber': '#FFAA00',
        'accent-red': '#FF3355',
        'text-primary': '#E8EFE8',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", 'monospace'],
        sans: ["'Outfit'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
