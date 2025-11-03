/**
 * Tokens de design pour le système de design
 * Utilisés pour maintenir la cohérence visuelle dans tout le projet
 */

export const colors = {
  primary: "#0EA5E9", // sky-500
  secondary: "#9333EA", // violet-600
  background: {
    light: "#F8FAFC", // slate-50
    dark: "#0F172A", // slate-900
  },
  text: {
    primary: "#0F172A", // slate-900
    secondary: "#64748B", // slate-500
    muted: "#94A3B8", // slate-400
  },
  destructive: "#EF4444", // red-500
  success: "#10B981", // emerald-500
  warning: "#F59E0B", // amber-500
  border: "#E2E8F0", // slate-200
} as const

export const spacing = {
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
  "2xl": "4rem", // 64px
} as const

export const borderRadius = {
  sm: "0.75rem", // 12px
  md: "0.875rem", // 14px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  full: "9999px",
} as const

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const

export const transitions = {
  fast: "150ms",
  default: "200ms",
  slow: "250ms",
  timing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const

export const typography = {
  fontFamily: {
    sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
} as const

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const


