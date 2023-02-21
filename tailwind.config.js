module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
    "./app/javascript/**/*.tsx",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%": { background: "#222" },
          "50%": { background: "#f9fafbbf" },
          "100%": { background: "#222" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
}
