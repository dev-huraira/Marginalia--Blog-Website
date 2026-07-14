/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#161719', // Main background (Midnight)
          darker: '#1E1F22',  // Faint hover/borders
          darkest: '#2D2F34', // Stronger borders
        },
        ink: {
          DEFAULT: '#EBE7E0', // Main text (Ivory)
          muted: '#AFAAA0',   // Secondary metadata
          light: '#7A766E',   // Disabled/faint tags
        },
        forest: {
          DEFAULT: '#C49E7A', // Accent warm copper gold
          hover: '#AD8662',   // Darker copper
          light: '#252422',   // Faint copper highlight
        },
        rose: {
          DEFAULT: '#5A6F62', // Accent sage green
          hover: '#47574D',   // Darker sage
          light: '#1C2220',   // Faint sage green highlight
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '2.0',
      },
      maxWidth: {
        reading: '68ch', // Optimal line length for editorial reading
      }
    },
  },
  plugins: [],
}
