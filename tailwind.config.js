/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        // Theme-aware colors (use CSS variables)
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        word: {
          bg: "var(--color-word-bg)",
          border: "var(--color-word-border)",
          text: "var(--color-word-text)",
          typed: "var(--color-word-typed)",
        },
        input: {
          bg: "var(--color-input-bg)",
          border: "var(--color-input-border)",
        },
        // Static colors (not theme-dependent)
        grey: "#E5E5E5",
        red: "#FF5E73",
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
