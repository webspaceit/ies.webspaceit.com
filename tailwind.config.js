import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#e6f5ed',
                    100: '#b3e0cc',
                    200: '#80ccaa',
                    300: '#4db789',
                    400: '#26a771',
                    500: '#007C47',
                    600: '#006e40',
                    700: '#005c35',
                    800: '#004b2b',
                    900: '#002d1a',
                },
            },
        },
    },

    plugins: [forms],
};
