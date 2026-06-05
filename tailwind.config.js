module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "qi-12-4qodeinteractivecomalabaster":
          "var(--qi-12-4qodeinteractivecomalabaster)",
        "qi-12-4qodeinteractivecomrangitoto":
          "var(--qi-12-4qodeinteractivecomrangitoto)",
        "qi-12-4qodeinteractivecomwhite":
          "var(--qi-12-4qodeinteractivecomwhite)",
        "qi124qodeinteractivecomcod-gray":
          "var(--qi124qodeinteractivecomcod-gray)",
        "qi124qodeinteractivecomouter-space":
          "var(--qi124qodeinteractivecomouter-space)",
        "qi124qodeinteractivecomrangoon-green":
          "var(--qi124qodeinteractivecomrangoon-green)",
        "qi124qodeinteractivecomsilver-chalice":
          "var(--qi124qodeinteractivecomsilver-chalice)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "qi124-qodeinteractive-com-raleway-regular":
          "var(--qi124-qodeinteractive-com-raleway-regular-font-family)",
        "qi124-qodeinteractive-com-semantic-heading-1-lower":
          "var(--qi124-qodeinteractive-com-semantic-heading-1-lower-font-family)",
        "qi124-qodeinteractive-com-semantic-heading-2-lower":
          "var(--qi124-qodeinteractive-com-semantic-heading-2-lower-font-family)",
        "qi124-qodeinteractive-com-semantic-heading-3-lower":
          "var(--qi124-qodeinteractive-com-semantic-heading-3-lower-font-family)",
        "qi124-qodeinteractive-com-semantic-heading-4-lower":
          "var(--qi124-qodeinteractive-com-semantic-heading-4-lower-font-family)",
        "qi124-qodeinteractive-com-semantic-input":
          "var(--qi124-qodeinteractive-com-semantic-input-font-family)",
        "qi124-qodeinteractive-com-semantic-input-title":
          "var(--qi124-qodeinteractive-com-semantic-input-title-font-family)",
        "qi124-qodeinteractive-com-semantic-link":
          "var(--qi124-qodeinteractive-com-semantic-link-font-family)",
        "qi124-qodeinteractive-com-semantic-link-lower":
          "var(--qi124-qodeinteractive-com-semantic-link-lower-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
