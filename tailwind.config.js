const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        featured_pattern: '#f4f45b',
        // featured_bg: `${url(
        //   "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.62'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        // )}`,
      },
      fontFamily: {
        // sans: [
        //   "Inter var",
        //   ...defaultTheme.fontFamily.sans,
        // ],
        sans: ['ui-sans-serif, system-ui,-apple-system', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        current: 'currentColor',
        white: '#ffffff',
        black: '#000',
        red: '#FF4036',
        custom_green: '#F4F45B',
        neutral: {
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5',
          400: '#d4d4d4',
          500: '#a3a3a3',
          600: '#737373',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      flex: {
        form_middle: '2 0',
        form_side: '1 0',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
