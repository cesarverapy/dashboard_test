import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Allow credentials to be supplied via environment variables when using a bundler
// like Vite (import.meta.env) or through global variables defined in a separate
// script (window.SUPABASE_URL / window.SUPABASE_ANON_KEY).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  window.SUPABASE_URL ||
  'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  window.SUPABASE_ANON_KEY ||
  'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
