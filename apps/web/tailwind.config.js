/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chalk: '#F1EFE8',
        paper: '#FAF9F4',
        ink: '#111318',
        cobalt: '#2743D6',
        acid: '#C6F24E',
        clay: '#E7E0D2',
        muted: 'rgba(17,19,24,0.62)',
        line: 'rgba(17,19,24,0.16)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      maxWidth: {
        '8xl': '88rem'
      }
    }
  },
  plugins: []
}
