/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1E1E1E',
        // Official Brand Identity
        primary: {
          DEFAULT: '#03110D', // Deep Forest (Primary Text)
          light: '#16302B',   // Emerald Green (Secondary Text)
        },
        brand: {
          DEFAULT: '#390517', // Primary Burgundy (Buttons, Highlights)
          hover: '#A38560',   // Luxury Gold (Hovers)
        },
        secondary: {
          DEFAULT: '#A38560', // Luxury Gold
          hover: '#B59976',
        },
        accent: {
          DEFAULT: '#A44529', // Burnt Copper
        },
        border: {
          DEFAULT: 'rgba(163, 133, 96, 0.3)', // Soft Luxury Gold
        },
        surface: {
          DEFAULT: '#E0E0E0', // Luxury White (Primary Background)
          secondary: '#EAEAEA', // Very light variation of E0E0E0
          dark: '#03110D',    // Deep Forest Background (Footer)
          white: '#FFFFFF',
        },
        success: {
          DEFAULT: '#16302B', // Emerald Green for success
        },
        error: {
          DEFAULT: '#C84040', // Red for validation
        },
      },
      fontFamily: {
        brand: ['Syne', 'sans-serif'],
        hero: ['Cormorant Garamond', 'serif'],
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(3, 17, 13, 0.05), 0 2px 4px -1px rgba(3, 17, 13, 0.03)',
        'card': '0 8px 30px -4px rgba(3, 17, 13, 0.08), 0 4px 12px -2px rgba(3, 17, 13, 0.04)',
        'card-hover': '0 24px 60px -8px rgba(3, 17, 13, 0.15), 0 12px 24px -4px rgba(3, 17, 13, 0.08)',
        'nav': '0 1px 0 0 rgba(163, 133, 96, 0.2)',
        'inner-soft': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'metallic': 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'lg': '24px',
        'xl': '40px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxury': 'cubic-bezier(0.25, 1, 0.25, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 1, 0.25, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.25, 1, 0.25, 1) forwards',
        'scale-in': 'scaleIn 0.8s cubic-bezier(0.25, 1, 0.25, 1) forwards',
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
