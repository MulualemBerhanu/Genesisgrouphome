import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#006400',
          yellow: '#FFFDE7',
          beige: '#FAF3E0',
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        display: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '6xl': '3.5rem',
        '7xl': '4.5rem',
      },
      letterSpacing: {
        'wider': '.1em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config;
