import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(15, 23, 42)",
        surface: "rgb(15, 23, 42)",
        foreground: "rgb(248, 250, 252)",
        panel: "rgb(7, 20, 38)",
        "green-primary": "rgb(0, 255, 65)",
        "green-accent": "rgb(124, 255, 0)"
      },
      container: {
        center: true,
        padding: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
