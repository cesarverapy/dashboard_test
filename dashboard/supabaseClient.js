import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Read credentials from environment variables provided by a bundler such as
// Vite. When running without a build step, you can also define global
// variables `SUPABASE_URL` and `SUPABASE_ANON_KEY` in a script tag.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
