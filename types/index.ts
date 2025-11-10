// Types TypeScript pour le projet

export type FormLayout = "one" | "page";

export interface Profile {
  id: string;
  org_id: string;
  role: string;
  created_at: string;
}

export interface Org {
  id: string;
  name: string;
  created_at: string;
}

export interface Form {
  id: string;
  org_id: string;
  title: string;
  slug: string;
  layout: FormLayout;
  schema_json: SchemaJSON;
  theme_json: ThemeJSON;
  settings_json: SettingsJSON;
  published: boolean;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  schema_json: SchemaJSON;
  theme_json: ThemeJSON;
  created_at: string;
}

export interface Response {
  id: string;
  form_id: string;
  created_at: string;
  ip: string | null;
  ua: string | null;
  answers_json: AnswersJSON;
  email: string | null;
  phone_raw: string | null;
  phone_e164: string | null;
  utm_json: UTMJSON | null;
  source: "link" | "embed";
  hidden_json: Record<string, unknown> | null;
}

// schema_json est directement un array de FormBlock dans la base de données
export type SchemaJSON = FormBlock[];

export interface FormBlock {
  id: string;
  type: BlockType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  [key: string]: unknown;
}

export type BlockType =
  | "welcome"
  | "heading"
  | "paragraph"
  | "single-choice"
  | "multiple-choice"
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "slider"
  | "date"
  | "yes-no"
  | "consent"
  | "captcha"
  | "youtube"
  | "menu-restaurant"
  | "file"
  | "image"
  | "dropdown"
  | "rating"
  | "address"
  | "website";

export interface ThemeJSON {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    family: string;
    size: string;
  };
  radius: number;
  style?: "minimal" | "gradient" | "glassmorphism" | "neon" | "elegant" | "modern" | "bold" | "soft";
  backgroundGradient?: string | null;
  backgroundImage?: string | null;
  backgroundImageOpacity?: number;
  backgroundImageBlur?: number;
  cardStyle?: "flat" | "elevated" | "glass" | "sectioned" | "bold" | "dynamic";
  shadowIntensity?: "none" | "light" | "medium" | "strong";
  shadowColor?: string;
  glassEffect?: boolean;
  neonEffect?: boolean;
  glowColor?: string;
  sectionColors?: boolean;
  elegantSpacing?: boolean;
  borderStyle?: "subtle" | "normal" | "bold";
  boldAccents?: boolean;
  energeticAnimations?: boolean;
  buttonStyle?: "default" | "rounded" | "pill" | "sharp" | "3d" | "outline" | "ghost" | "gradient" | "glassmorphism" | "neumorphism" | "gradient-animated" | "glow" | "elevated" | "minimal" | "bold" | "soft" | "modern" | "ripple" | "flat" | "skeuomorphic";
  buttonSize?: "sm" | "md" | "lg" | "xl";
  buttonAnimation?: "none" | "hover-lift" | "hover-grow" | "hover-shine" | "hover-pulse" | "hover-glow" | "hover-slide" | "hover-bounce" | "hover-rotate" | "hover-gradient" | "hover-border" | "hover-scale-down" | "hover-wiggle" | "hover-ripple" | "hover-float" | "hover-shake" | "hover-squeeze" | "hover-flip" | "hover-glow-pulse" | "hover-slide-up" | "hover-slide-down" | "hover-slide-left" | "hover-slide-right" | "hover-zoom-in" | "hover-zoom-out" | "hover-elastic" | "hover-3d-tilt" | "hover-spin-slow" | "hover-gradient-shift" | "hover-blur-focus" | "hover-skew" | "hover-perspective" | "hover-wave" | "hover-magnetic" | "hover-liquid" | "hover-breathe";
  [key: string]: unknown;
}

export interface SettingsJSON {
  maxResponses?: number | null;
  expiresAt?: string | null;
  redirectUrl?: string | null;
  [key: string]: unknown;
}

export interface AnswersJSON {
  [blockId: string]: unknown;
}

export interface UTMJSON {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  [key: string]: unknown;
}

