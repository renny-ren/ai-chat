module.exports = {
  darkMode: "class",
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
    "./app/javascript/**/*.tsx",
  ],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        // blink: {
        //   "0%": { background: "#222" },
        //   "50%": { background: "#f9fafbbf" },
        //   "100%": { background: "#222" },
        // },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        // blink: {
        //   "0%": { opacity: 1 },
        //   "50%": { opacity: 0 },
        //   "100%": { opacity: 1 },
        // },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
}
