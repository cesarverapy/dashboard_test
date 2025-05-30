import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Prefer environment variables injected by a build tool such as Vite.
// Fall back to globals defined on `window` when served statically.
const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  window.SUPABASE_URL ||
  'YOUR_SUPABASE_URL';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  window.SUPABASE_ANON_KEY ||
  'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
