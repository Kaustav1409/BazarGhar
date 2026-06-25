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
        blue: {
          DEFAULT: '#2F80ED',
          hover: '#2566c4',
        },
        green: {
          DEFAULT: '#52C41A',
          hover: '#40a014',
        },
        grey: {
          DEFAULT: '#BDBDBD',
          light: '#F5F5F5',
          dark: '#757575',
        },
        surface: '#FFFFFF',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['Faculty Glyphic', 'sans-serif'],
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
        'soft': '0 2px 8px -2px rgba(17, 24, 39, 0.05), 0 1px 2px -1px rgba(17, 24, 39, 0.03)',
        'card': '0 8px 30px -4px rgba(17, 24, 39, 0.04), 0 4px 12px -2px rgba(17, 24, 39, 0.02)',
        'card-hover': '0 24px 60px -8px rgba(17, 24, 39, 0.1), 0 12px 24px -4px rgba(17, 24, 39, 0.04)',
        'gold': '0 4px 20px -4px rgba(212, 175, 55, 0.45)',
        'gold-lg': '0 8px 32px -4px rgba(212, 175, 55, 0.35)',
        'nav': '0 1px 0 0 rgba(17, 24, 39, 0.06)',
        'inner-soft': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
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
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotateZ(0)', opacity: '1' },
          '100%': { transform: 'translateY(120px) rotateZ(720deg)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'scale-in': 'scaleIn 0.4s ease forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
        'progress-fill': 'progressFill 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
