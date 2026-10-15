/**
 * Permanent Supabase Configuration
 * 
 * These credentials are permanently embedded in the frontend codebase and environment.
 * This guarantees that every device, mobile phone, browser (including private/incognito),
 * and network will ALWAYS show the actual Supabase URL & Anon Key, and will never become empty.
 */

// Permanent hardcoded fallback credentials
// Paste your project URL and Anon Public Key here if not using .env
export const PERMANENT_SUPABASE_CONFIG = {
  url: 'https://anvgipmxlsiwhzplsnne.supabase.co',
  anonKey: 'sb_publishable_fuzPA05yUMvsIZ-ZKxwfRw_8nIRQaYe',
};

export const hasPermanentConfig = Boolean(
  PERMANENT_SUPABASE_CONFIG.url && PERMANENT_SUPABASE_CONFIG.anonKey
);
