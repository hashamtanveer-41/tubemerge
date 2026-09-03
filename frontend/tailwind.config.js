/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          base: '#0F0F0F',
          surface: '#161616',
          card: '#181818',
          panel: '#1C1C1C',
          elevated: '#212121',
          hover: '#282828',
          input: '#121212',
        },
        stroke: {
          subtle: '#212121',
          card: '#282828',
          light: '#303030',
          hover: '#383838',
        },
        brand: {
          red: '#FF0000',
          redHover: '#CC0000',
          redDark: '#990000',
        },
        content: {
          primary: '#FFFFFF',
          secondary: '#AAAAAA',
          muted: '#717171',
          dim: '#555555',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
