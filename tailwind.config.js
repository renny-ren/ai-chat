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
        // blink: {
        //   "0%": { background: "#222" },
        //   "50%": { background: "#f9fafbbf" },
        //   "100%": { background: "#222" },
        // },
        blink: {
          "0%": { opacity: 1 },
          "50%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
}
