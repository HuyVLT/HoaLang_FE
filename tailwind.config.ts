import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        parchment:  "var(--color-parchment)",
        cream:      "var(--color-cream)",
        charcoal:   "var(--color-charcoal)",
        ink:        "var(--color-ink)",
        lacquer:    "var(--color-lacquer)",
        gold:       "var(--color-gold)",
        bronze:     "var(--color-bronze)",
        stone:      "var(--color-stone)",
        ash:        "var(--color-ash)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "var(--font-noto-serif)", "Cormorant Garamond", "Noto Serif CJK JP", "Noto Serif CJK KR", "Noto Serif CJK SC", "Noto Serif CJK TC", "Hiragino Mincho ProN", "MS Mincho", "Songti SC", "SimSun", "serif"],
        sans: ["var(--font-sans)", "var(--font-noto-sans)", "Be Vietnam Pro", "Noto Sans CJK JP", "Noto Sans CJK KR", "Noto Sans CJK SC", "Noto Sans CJK TC", "PingFang SC", "Hiragino Kaku Gothic ProN", "Heiti SC", "Microsoft YaHei", "Malgun Gothic", "sans-serif"],
        display: ["var(--font-heading)", "var(--font-noto-serif)", "Cormorant Garamond", "Noto Serif CJK JP", "Noto Serif CJK KR", "Noto Serif CJK SC", "Noto Serif CJK TC", "Hiragino Mincho ProN", "MS Mincho", "Songti SC", "SimSun", "serif"],
        body: ["var(--font-sans)", "var(--font-noto-sans)", "Be Vietnam Pro", "Noto Sans CJK JP", "Noto Sans CJK KR", "Noto Sans CJK SC", "Noto Sans CJK TC", "PingFang SC", "Hiragino Kaku Gothic ProN", "Heiti SC", "Microsoft YaHei", "Malgun Gothic", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
