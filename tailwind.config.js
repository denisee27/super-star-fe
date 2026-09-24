/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "superstar-blue": "#0041FB",
        "deep-blue": "#001A66",
        ink: "#0A0A0A",
        graphite: "#474747",
        cloud: "#F4F6FB",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0041FB 0%, #001A66 100%)",
      },
      keyframes: {
        "loading-bar": {
          "0%":   { transform: "translateX(-100%)" },
          "50%":  { transform: "translateX(150%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "loading-bar": "loading-bar 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

