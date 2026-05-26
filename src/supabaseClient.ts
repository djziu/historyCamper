import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if credentials are set and not the default placeholder
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project-id.supabase.co'
)

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface QuizQuestion {
  id?: number | string;
  era: string;      // e.g., 'joseon', 'baekje', 'goryeo', etc.
  region: string;   // e.g., '완주', '전주', '익산'
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface Campsite {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  era: string;
  tags: string[];
  distanceToHistoric: number;
  nearbyHeritageIds: string[];
  resveCl?: string;
  resveUrl?: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  era: string;
}

export interface FavoriteItem {
  id?: number;
  campsite_id: string;
  device_id: string;
  status: 'planned' | 'visited';
  created_at?: string;
}
