import type { Config } from 'tailwindcss'

export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#35475A',
        'secondary': '#FD5D5D',
      },
    },
  },
  plugins: [],
} satisfies Config

