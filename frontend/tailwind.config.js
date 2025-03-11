/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Use class strategy for dark mode
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "bg-light": "var(--bg-light)",
        "bg-dark": "var(--bg-dark)",
        "text-light-primary": "var(--text-light-primary)",
        "text-light-secondary": "var(--text-light-secondary)",
        "text-dark-primary": "var(--text-dark-primary)",
        "text-dark-secondary": "var(--text-dark-secondary)",
        "border-light": "var(--border-light)",
        "border-dark": "var(--border-dark)",
      },
    },
  },
  plugins: [],
};
