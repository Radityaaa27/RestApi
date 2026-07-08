/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Corporate Slate & Warm Muted palette (design.md §1)
        primary: {
          DEFAULT: "#1E293B", // Slate Dark - text, headers, brand
        },
        secondary: {
          DEFAULT: "#475569", // Muted Slate - subheadings, borders, secondary actions
        },
        canvas: "#F8FAFC", // Background
        surface: "#FFFFFF", // Cards / containers
        interactive: {
          DEFAULT: "#0F766E", // Teal Muted - success / primary actions
          hover: "#0B5A54", // darker teal for hover state
        },
        danger: {
          DEFAULT: "#991B1B", // Deep Crimson - errors / deletes
        },
        border: {
          DEFAULT: "#E2E8F0", // navbar / dividers
          input: "#CBD5E1", // input borders
        },
        tint: "#F1F5F9", // metrics card tint
        alert: {
          "success-bg": "#F0FDF4",
          "success-text": "#166534",
          "success-border": "#BBF7D0",
          "error-bg": "#FEF2F2",
          "error-text": "#991B1B",
          "error-border": "#FEE2E2",
        },
      },
      fontSize: {
        h1: ["24px", { fontWeight: "700" }],
        h2: ["18px", { fontWeight: "600" }],
        body: ["14px", { fontWeight: "400" }],
        caption: ["12px", { fontWeight: "500" }],
      },
      spacing: {
        // Base-8 spacing system (design.md §1)
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(30, 41, 59, 0.1), 0 1px 2px -1px rgba(30, 41, 59, 0.08)",
      },
      maxWidth: {
        auth: "420px",
        form: "768px",
      },
    },
  },
  plugins: [],
};
