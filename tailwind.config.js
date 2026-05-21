/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Bright pastel gradients for kid-friendly design
                'pastel-pink': '#FFB3E6',
                'pastel-blue': '#B3D9FF',
                'pastel-green': '#B3FFB3',
                'pastel-yellow': '#FFFFE0',
                'pastel-purple': '#E6B3FF',
                'pastel-orange': '#FFD9B3',
                'primary-light': '#FF6B9D',
                'primary': '#FF1493',
                'secondary': '#00CED1',
                'accent-yellow': '#FFD700',
                'accent-green': '#3FD550',
                'success': '#00D26E',
                'warning': '#FFA500',
                'danger': '#FF6B6B',
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'scale-up': 'scale-up 0.3s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'slide-up': {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-up': {
                    'from': { transform: 'scale(0.8)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                },
                'wiggle': {
                    '0%, 100%': { transform: 'rotate(-1deg)' },
                    '50%': { transform: 'rotate(1deg)' },
                },
            },
            borderRadius: {
                'xl': '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 10px 30px rgba(0, 0, 0, 0.1)',
                'soft-lg': '0 20px 40px rgba(0, 0, 0, 0.12)',
                'neon': '0 0 20px rgba(255, 107, 157, 0.4)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        fontSize: '1.125rem',
                        lineHeight: '1.75rem',
                    },
                },
            },
        },
    },
    plugins: [],
};
