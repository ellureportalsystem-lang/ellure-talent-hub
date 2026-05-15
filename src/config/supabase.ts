// Supabase Configuration
// ============================================================================
// This file serves as a FALLBACK configuration for Supabase.
// 
// ⚠️  IMPORTANT: Environment variables take precedence over this config file.
// 
// The application will use these values in this order:
// 1. Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) - PREFERRED ✅
// 2. This config file - FALLBACK ONLY (used if env vars not set)
//
// 📝 To configure Supabase (RECOMMENDED):
// 1. Create/update your .env file in the project root with:
//    VITE_SUPABASE_URL=https://your-project-id.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key-here
//
// 2. Restart your dev server after updating .env (Vite only reads .env on startup)
//
// 🔒 Security Note:
// The anon key is designed for client-side use and is safe to expose.
// Never commit your service role key to version control.
//
// 📌 Current Setup:
// Since you've updated your .env file, the environment variables will be used
// automatically. This config file is kept as a fallback for compatibility.
// ============================================================================

export const SUPABASE_CONFIG = {
  // ⚠️  FALLBACK VALUES ONLY - These are used if environment variables are not set
  // For production, always use environment variables via .env file
  // Update these if you need a fallback (e.g., for Lovable preview or testing)
  url: '', // Leave empty to force use of environment variables
  anonKey: '', // Leave empty to force use of environment variables
  
  // If you need fallback values (not recommended), uncomment and update:
  // url: 'https://your-project-id.supabase.co',
  // anonKey: 'your-anon-key-here',
};




















