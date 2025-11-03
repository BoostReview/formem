// Constantes du projet

export const DEFAULT_THEME = {
  colors: {
    primary: "#0EA5E9",
    secondary: "#9333EA",
    background: "#F8FAFC",
    text: "#0F172A",
  },
  fonts: {
    family: "Inter",
    size: "16px",
  },
  radius: 14,
};

export const FORM_LAYOUTS = {
  ONE: "one" as const,
  PAGE: "page" as const,
};

export const BLOCK_TYPES = {
  HEADING: "heading",
  PARAGRAPH: "paragraph",
  SINGLE_CHOICE: "single-choice",
  MULTIPLE_CHOICE: "multiple-choice",
  TEXT: "text",
  TEXTAREA: "textarea",
  EMAIL: "email",
  PHONE: "phone",
  NUMBER: "number",
  SLIDER: "slider",
  DATE: "date",
  YES_NO: "yes-no",
  CONSENT: "consent",
  YOUTUBE: "youtube",
} as const;


