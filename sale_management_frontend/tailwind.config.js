/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,tsx,jsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "830px",
        lg: "1400px",
        xl: "1920px",
      },
      colors: {
        darkGreen: "#4B5945",
        pastelGreen: "#D9DFC6",
      },
      backgroundColor: {
        darkGreen: "#4B5945",
        pastelGreen: "#D9DFC6",
      },
    },
  },
  plugins: [],
};
