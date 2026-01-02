/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f9fa',
                    100: '#d7eff2',
                    200: '#b2dde3',
                    300: '#80c1cd',
                    400: '#53a0b1',
                    500: '#388596',
                    600: '#2f6b7a',
                    700: '#2a5763',
                    800: '#284953',
                    900: '#233e47',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
