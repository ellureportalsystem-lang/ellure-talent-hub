import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

// Get environment variables (preferred) or fall back to config file
// Note: In Vite, environment variables must be prefixed with VITE_ to be accessible in the client
// For Lovable preview, we fall back to the config file since env vars aren't available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_CONFIG.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
❌ Missing Supabase configuration!

Required values:
  - VITE_SUPABASE_URL (or config file)
  - VITE_SUPABASE_ANON_KEY (or config file)

⚠️  IMPORTANT: In Vite, environment variables MUST be prefixed with VITE_ to be accessible in client code.

For local development, your .env file should look like:
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here

For Lovable preview, the config file (src/config/supabase.ts) is used as fallback.

Current values:
  VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL ? '✅ Set (env)' : SUPABASE_CONFIG.url ? '✅ Set (config)' : '❌ Missing'}
  VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set (env)' : SUPABASE_CONFIG.anonKey ? '✅ Set (config)' : '❌ Missing'}

📝 Steps to fix:
1. For local dev: Check your .env file is in the project root
2. For Lovable: The config file should work automatically
3. Restart your dev server (npm run dev)

See docs/fix-env-variables.md for detailed help.
  `.trim();
  
  throw new Error(errorMessage);
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

