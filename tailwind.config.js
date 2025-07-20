/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'aaaaaa': '#aaaaaa',
        'bbbbbb': '#bbbbbb',
        'cccccc': '#cccccc',
        'dddddd': '#dddddd',
        'eeeeee': '#eeeeee',
        '111111': '#111111',
        '222222': '#222222',
        '333333': '#333333',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
