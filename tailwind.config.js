/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        cardBackground: '#1A1A1E',
        border: '#2D2D33',
        primary: '#8E7CFF',
        primaryLight: '#B5A8FF',
        primaryDark: '#5A4ECF',
        accent: '#FF6F91',
        success: '#4ADE80',
        warning: '#FBBF24',
        info: '#38BDF8',
        textPrimary: '#FFFFFF',
        textSecondary: '#C5C5C5',
        button: '#5A4ECF',
        lightBlue: '#3F3CBB',
      },
      fontFamily: {
        ibmpRegular: 'IBMPRegular',
        ibmpBold: 'IBMPLexSansThaiLooped-Bold',
        heading: ['DanaBold'],
        danaRegular: ['DanaRegular'],
      },
      fontSize: {
        '2xs': '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.115rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        card: '0px 2px 10px rgba(38, 38, 38, 0.1)',
        button: '0px 3px 10px rgba(38, 38, 38, 0.2)',
      },
      borderRadius: {
        lg: '12px',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
};
