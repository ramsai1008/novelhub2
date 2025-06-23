import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode support
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
