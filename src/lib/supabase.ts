import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CmsStoreData, SupabaseConfig } from '../types/cms';

const STORAGE_KEY_SUPABASE_CONFIG = 'iqrshop_supabase_config_v1';
const CMS_TABLE_NAME = 'site_cms_data';

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading Supabase config from localStorage:', e);
  }

  // Check Vite env variables as fallback
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    isConnected: false,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving Supabase config to localStorage:', e);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(overrideConfig?: { url: string; anonKey: string }): SupabaseClient | null {
  const cfg = overrideConfig || getStoredSupabaseConfig();
  if (!cfg.url || !cfg.anonKey || !cfg.url.startsWith('http')) {
    return null;
  }

  const clientKey = `${cfg.url}:${cfg.anonKey}`;
  if (cachedClient && lastClientKey === clientKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: false },
    });
    lastClientKey = clientKey;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

// Test connection to Supabase
export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!url || !anonKey) {
      return { success: false, message: 'URL এবং Anon Key উভয়ই প্রদান করুন।' };
    }
    const client = createClient(url, anonKey);
    const { error } = await client.from(CMS_TABLE_NAME).select('id').limit(1);

    if (error) {
      // Table might not exist yet
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation')) {
        return {
          success: true,
          message: `কানেকশন সফল! তবে '${CMS_TABLE_NAME}' টেবিলটি তৈরি করা হয়নি। নিচে দেওয়া SQL রান করুন।`,
        };
      }
      return { success: false, message: `ত্রুটি: ${error.message}` };
    }

    return { success: true, message: 'Supabase ডাটাবেসের সাথে কানেকশন সফল ও টেবিল বিদ্যমান!' };
  } catch (err: any) {
    return { success: false, message: `কানেক্ট করতে সমস্যা হয়েছে: ${err?.message || 'অজানা সমস্যা'}` };
  }
}

// Fetch CMS Data from Supabase
export async function fetchCmsDataFromSupabase(): Promise<CmsStoreData | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from(CMS_TABLE_NAME)
      .select('data')
      .eq('id', 'main_cms_config')
      .single();

    if (error) {
      console.warn('Supabase fetch error or no data found:', error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as CmsStoreData;
    }
  } catch (e) {
    console.error('Failed to fetch from Supabase:', e);
  }
  return null;
}

// Save/Sync CMS Data to Supabase
export async function saveCmsDataToSupabase(cmsData: CmsStoreData): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase কনফিগারেশন সেট করা নেই।' };
  }

  try {
    const { error } = await client
      .from(CMS_TABLE_NAME)
      .upsert(
        {
          id: 'main_cms_config',
          data: cmsData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      return { success: false, message: `সেভ করতে ত্রুটি: ${error.message}` };
    }

    return { success: true, message: 'Supabase ডাটাবেসে সফলভাবে সেভ হয়েছে!' };
  } catch (err: any) {
    return { success: false, message: `সেভ ব্যর্থ: ${err?.message || 'অজানা ত্রুটি'}` };
  }
}

// Supabase SQL Schema for the user to copy & paste
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- 1. Create table for Central Site CMS Data
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_cms_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_cms_data ENABLE ROW LEVEL SECURITY;

-- 3. Allow Public Read (ভিজিটরদের জন্য পড়ার পারমিশন)
CREATE POLICY "Allow public read on site_cms_data" 
ON public.site_cms_data 
FOR SELECT 
TO public 
USING (true);

-- 4. Allow Public/Anon Insert and Update (অ্যাডমিন প্যানেল থেকে আপডেটের জন্য)
CREATE POLICY "Allow all to upsert site_cms_data" 
ON public.site_cms_data 
FOR ALL 
TO public 
USING (true)
WITH CHECK (true);
`;
