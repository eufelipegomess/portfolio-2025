import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments (Vite, CRA, etc.)
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // Check Vite (import.meta.env)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}

  try {
    // Check process.env
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return fallback;
};

// ATENÇÃO: Configure suas variáveis de ambiente no arquivo .env
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://placeholder-project.supabase.co');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'placeholder-key');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);