/**
 * Types TypeScript generes pour Supabase
 * Module 2 : Base de Donnees
 */

// ============================================
// TYPES ENUMS
// ============================================

export type FormLayout = 'one' | 'page';

export type ResponseSource = 'link' | 'embed';

export type ProfileRole = 'owner' | 'admin' | 'member';

// ============================================
// TYPES JSONB
// ============================================

/**
 * Structure d'un bloc de formulaire (dans schema_json)
 */
export interface FormBlock {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'phone' | 'rating' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  options?: Array<{ label: string; value: string }>;
  order: number;
  [key: string]: unknown;
}

export type FormSchema = FormBlock[];

/**
 * Configuration du theme du formulaire (dans theme_json)
 */
export interface FormTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  buttonStyle?: 'filled' | 'outlined' | 'text';
  [key: string]: unknown;
}

/**
 * Parametres du formulaire (dans settings_json)
 */
export interface FormSettings {
  maxResponses?: number;
  expiresAt?: string; // ISO date string
  redirectUrl?: string;
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  confirmMessage?: string;
  [key: string]: unknown;
}

/**
 * Reponses du formulaire (dans answers_json)
 */
export interface FormAnswers {
  [blockId: string]: string | number | boolean | string[] | File | null;
}

/**
 * Parametres UTM (dans utm_json)
 */
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  [key: string]: unknown;
}

/**
 * Donnees cachees (dans hidden_json)
 */
export interface HiddenData {
  [key: string]: unknown;
}

// ============================================
// TYPES DES TABLES SUPABASE
// ============================================

/**
 * Table: orgs
 */
export interface Org {
  id: string;
  name: string;
  created_at: string;
}

/**
 * Table: profiles
 */
export interface Profile {
  id: string;
  org_id: string;
  role: ProfileRole;
  created_at: string;
}

/**
 * Table: forms
 */
export interface Form {
  id: string;
  org_id: string;
  title: string;
  slug: string | null;
  layout: FormLayout;
  schema_json: FormSchema;
  theme_json: FormTheme;
  settings_json: FormSettings;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Table: templates
 */
export interface Template {
  id: string;
  title: string;
  schema_json: FormSchema;
  theme_json: FormTheme;
  created_at: string;
}

/**
 * Table: responses
 */
export interface Response {
  id: string;
  form_id: string;
  created_at: string;
  ip: string | null;
  ua: string | null;
  answers_json: FormAnswers;
  email: string | null;
  phone_raw: string | null;
  phone_e164: string | null;
  utm_json: UTMParams;
  source: ResponseSource | null;
  hidden_json: HiddenData;
}

// ============================================
// TYPES POUR LES INSERTIONS
// ============================================

export type OrgInsert = Omit<Org, 'id' | 'created_at'>;
export type ProfileInsert = Omit<Profile, 'created_at'>;
export type FormInsert = Omit<Form, 'id' | 'created_at' | 'updated_at'>;
export type TemplateInsert = Omit<Template, 'id' | 'created_at'>;
export type ResponseInsert = Omit<Response, 'id' | 'created_at'>;

// ============================================
// TYPES POUR LES MISES A JOUR
// ============================================

export type OrgUpdate = Partial<Omit<Org, 'id' | 'created_at'>>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type FormUpdate = Partial<Omit<Form, 'id' | 'org_id' | 'created_at'>>;
export type TemplateUpdate = Partial<Omit<Template, 'id' | 'created_at'>>;
export type ResponseUpdate = Partial<Omit<Response, 'id' | 'form_id' | 'created_at'>>;

// ============================================
// TYPES POUR LES RELATIONS
// ============================================

export interface FormWithOrg extends Form {
  org: Org;
}

export interface FormWithResponses extends Form {
  responses: Response[];
  responseCount?: number;
}

export interface ResponseWithForm extends Response {
  form: Form;
}

export interface ProfileWithOrg extends Profile {
  org: Org;
}

export interface OrgWithProfiles extends Org {
  profiles: Profile[];
}

export interface OrgWithForms extends Org {
  forms: Form[];
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Type pour les resultats pagines
 */
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Type pour les filtres de recherche
 */
export interface FormFilters {
  published?: boolean;
  search?: string;
  orgId?: string;
}

export interface ResponseFilters {
  formId?: string;
  email?: string;
  dateFrom?: string;
  dateTo?: string;
}





