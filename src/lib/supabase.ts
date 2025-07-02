import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
// NOTA: Essas são chaves públicas, é seguro expor no frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      instagram_data: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          followers: number;
          following?: number;
          posts?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          followers: number;
          following?: number;
          posts?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          followers?: number;
          following?: number;
          posts?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits_data: {
        Row: {
          id: string;
          user_id: string;
          habit_data: any; // JSON com todos os dados dos hábitos
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 