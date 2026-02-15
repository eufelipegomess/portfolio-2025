import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars without crashing
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const value = import.meta.env[key];
      // Ensure we only return string
      return typeof value === 'string' ? value : '';
    }
  } catch (e) {
    // ignore
  }
  return '';
};

// Provided Credentials
const FALLBACK_URL = 'https://uoolgmgpfelnfwhokfii.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb2xnbWdwZmVsbmZ3aG9rZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMTgyODEsImV4cCI6MjA4NjY5NDI4MX0.ZhYQLc-N-wM1nGcilliFD6yD6mS6xbSwO_VV_zKfEnc';

// Try to get from Env, otherwise use the provided credentials directly
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || FALLBACK_URL;
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials missing!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);