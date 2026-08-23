/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        navy: "#16223d",
        "navy-light": "#243252",
        gold: "#c9a24b",
        "gold-bright": "#e3c876",
        parchment: "#f6f3ea",
        "parchment-dim": "#efeadb",
        muted: "#5b6478",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        vazir: ["Vazirmatn", "sans-serif"],
        display: ["Fraunces", "serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,.04), 0 12px 32px -12px rgba(11,18,32,.12)",
        seal: "0 6px 18px -4px rgba(201,162,75,.45)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(11,18,32,.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};