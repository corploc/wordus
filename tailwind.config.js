/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        background: "#353F54",
        grey: "#E5E5E5",
        red: "#FF5E73",
        word: {
          default: "#D6D6D6",
          font: {
            default: "#A9A9A9",
            fill: "#7C7C7C",
          },
        },
        player: {
          "dark-pink": "#B85EFF",
          "light-pink": "#FF5EBA",
          blue: "#5E94FF",
          yellow: "#FFCC5E",
          green: "#2CDA75",
          brown: "#BE7B67",
        },
        podium: {
          first: "#FFE300",
          second: "#939393",
          third: "#FF8E00",
        },
      },
      fontFamily: {
        spartan: ["Spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
};
