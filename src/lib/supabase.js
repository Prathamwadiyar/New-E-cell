import { createClient } from '@supabase/supabase-js';

// Public (publishable/anon) credentials only. These are safe to ship to the
// browser because Row Level Security is the real authorization boundary.
// NEVER place the service-role key here or in any VITE_* variable.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'public-anon-key-placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  // Non-fatal: allows the production build to succeed. Network calls will fail
  // until real values are provided in .env.local.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Copy .env.example to .env.local and fill in your project values.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
