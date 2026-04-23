import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6f9",
          100: "#dce7ee",
          200: "#b8ccd9",
          300: "#89a9bf",
          400: "#5f88a6",
          500: "#456f8c",
          600: "#355972",
          700: "#2d495d",
          800: "#283d4e",
          900: "#243342",
        },
        accent: {
          sky: "#d8ecf8",
          mint: "#dcefe8",
          amber: "#f8edd1",
          rose: "#f4dede",
        },
      },
      boxShadow: {
        panel: "0 20px 45px -28px rgba(23, 37, 84, 0.28)",
      },
      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(rgba(69,111,140,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(69,111,140,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
