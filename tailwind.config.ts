import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
        display: ["var(--font-display)", "Orbitron", "monospace"],
      },
      colors: {
        // Retro colors
        "retro-dark": "rgb(10 5 15)",
        "retro-darker": "rgb(5 2 8)",
        "retro-light": "rgb(240 240 255)",
        "retro-cyan": "rgb(0 255 255)",
        "retro-pink": "rgb(255 20 147)",
        "retro-purple": "rgb(138 43 226)",
        "retro-yellow": "rgb(255 255 0)",
        "retro-orange": "rgb(255 140 0)",
        "retro-green": "rgb(50 205 50)",

        // UI colors based on CSS variables
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "retro-grid": "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
        scanlines:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)",
      },
      backgroundSize: {
        "retro-grid": "20px 20px",
      },
      boxShadow: {
        retro: "0 0 20px rgba(0, 255, 255, 0.3)",
        "retro-strong": "0 0 30px rgba(0, 255, 255, 0.5)",
        "neon-cyan": "0 0 5px rgb(0 255 255), 0 0 10px rgb(0 255 255), 0 0 15px rgb(0 255 255)",
        "neon-pink": "0 0 5px rgb(255 20 147), 0 0 10px rgb(255 20 147), 0 0 15px rgb(255 20 147)",
        "neon-purple": "0 0 5px rgb(138 43 226), 0 0 10px rgb(138 43 226), 0 0 15px rgb(138 43 226)",
        "neon-yellow": "0 0 5px rgb(255 255 0), 0 0 10px rgb(255 255 0), 0 0 15px rgb(255 255 0)",
        "neon-green": "0 0 5px rgb(50 205 50), 0 0 10px rgb(50 205 50), 0 0 15px rgb(50 205 50)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor",
          },
          "50%": {
            boxShadow: "0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
