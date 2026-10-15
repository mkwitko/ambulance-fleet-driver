const { COLORS } = require("./src/styles/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: COLORS,
      fontFamily: {
        300: ["Inter_300Light"],
        400: ["Inter_400Regular"],
        500: ["Inter_500Medium"],
        600: ["Inter_600SemiBold"],
        700: ["Inter_700Bold"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
