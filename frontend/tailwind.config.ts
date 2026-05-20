import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ritual: {
          gold: "#C9A84C",
          amber: "#E8B94F",
          dark: "#0A0806",
          deep: "#120F0A",
          surface: "#1C1610",
          muted: "#2A2218",
          text: "#F5ECD7",
          dim: "#8A7A5C",
        },
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(201,168,76,0.7)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
