import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Language = 'en' | 'es';

export interface Category {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
  order_index: number;
}

export interface GlossaryTerm {
  id: string;
  category_id: string;
  term_en: string;
  term_es: string;
  definition_en: string;
  definition_es: string;
  example_en: string;
  example_es: string;
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  question_en: string;
  question_es: string;
  options_en: string[];
  options_es: string[];
  correct_answer: number;
  explanation_en: string;
  explanation_es: string;
}
