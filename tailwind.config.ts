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
                // Earthy, sophisticated palette
                primary: {
                    DEFAULT: '#1C1C1C',
                    light: '#2D2D2D',
                    dark: '#0A0A0A',
                },
                secondary: {
                    DEFAULT: '#8B7355',
                    light: '#A89078',
                    dark: '#6B5544',
                },
                accent: {
                    DEFAULT: '#C4A77D',
                    warm: '#D4B896',
                    muted: '#B8A08A',
                },
                cream: {
                    DEFAULT: '#F5F1EB',
                    dark: '#E8E2D9',
                    light: '#FAF8F5',
                },
                sage: {
                    DEFAULT: '#87907C',
                    light: '#A5AD9C',
                    dark: '#6B7460',
                },
                terracotta: {
                    DEFAULT: '#C17F59',
                    light: '#D4967A',
                    dark: '#A66B48',
                },
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
                body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
                'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
                'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
                'body-lg': ['1.125rem', { lineHeight: '1.75' }],
                'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
                'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '128': '32rem',
            },
            animation: {
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-out-right': 'slideOutRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'scale-in': 'scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'reveal': 'reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
                'marquee': 'marquee 30s linear infinite',
                'pulse-slow': 'pulse 4s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-60px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(60px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideOutRight: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(80px)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                reveal: {
                    '0%': { clipPath: 'inset(0 100% 0 0)' },
                    '100%': { clipPath: 'inset(0 0% 0 0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-warm': 'linear-gradient(135deg, #C4A77D 0%, #C17F59 100%)',
                'gradient-dark': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
