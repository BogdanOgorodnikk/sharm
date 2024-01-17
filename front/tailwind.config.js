const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "node_modules/vue-tailwind/dist/*.js",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      spacing: {
        100: "25rem", //      400px
        125: "31.25rem", //   500px
        150: "37.5rem", //    600px
        175: "43.75rem", //   700px
        200: "50rem", //      800px
        225: "56.25rem", //   900px
        250: "62.5rem", //    1000px
        275: "68.75rem", //   1100px
        300: "75rem", //      1200px
      },
      fontSize: {
        "2xs": ["0.625rem", "0.75rem"], //  10px
        xs: ["0.75rem", "0.875rem"], //     12px
        sm: ["0.875rem", "1rem"], //        14px
        base: ["1rem", "1.1875rem"], //     16px
        lg: ["1.125rem", "1.3125rem"], //   18px
        "2lg": ["1.375rem", "1.625rem"], // 22px TODO: Removed later
        "2xl": ["1.5rem", "1.75rem"], //    24px
        "3xl": ["1.75rem", "2.0625rem"], // 28px
        "4xl": ["2rem", "2.3125rem"], //    32px
        "5xl": ["3rem", "3.5rem"], //       48px
      },
      colors: {
        gray: {
          450: "#838B97",
        },
      },
      opacity: {
        15: ".15",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      base: {
        dark: "#181C32",
        "dark-brown": "#232323",
        light: "#EDF0F8",
        "bright-red": "#F00000",
        "deep-red": "#C40808",
        "light-gray": "#b9c1ca",
      },
      accent: "",
      gray: colors.gray,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      violet: colors.violet,
      black: colors.black,
      white: colors.white,
      orange: colors.orange,
      fuchsia: colors.fuchsia,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
