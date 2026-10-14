import { getSupabaseClient } from './supabase';
import type { ComboChart, CreateComboChartInput, UpdateComboChartInput, Product } from '../types';

const COMBO_TABLE_NAME = 'combo_charts';
const LOCAL_STORAGE_KEY = 'iqrshop_combo_charts_cache_v1';

// SQL Schema for Supabase
export const COMBO_CHARTS_SQL_SCHEMA = `-- ==========================================
-- 1. Create table for Combo Charts
-- ==========================================
CREATE TABLE IF NOT EXISTS public.combo_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  package_size TEXT NOT NULL,
  shape TEXT DEFAULT 'circle',
  is_active BOOLEAN NOT NULL DEFAULT true,
  category_id TEXT,
  product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.combo_charts ENABLE ROW LEVEL SECURITY;

-- 3. Allow Public Read on Active Combo Charts
CREATE POLICY "Allow public read on combo_charts" 
ON public.combo_charts 
FOR SELECT 
TO public 
USING (true);

-- 4. Allow All Operations for Admin / Service
CREATE POLICY "Allow all operations on combo_charts" 
ON public.combo_charts 
FOR ALL 
TO public 
USING (true)
WITH CHECK (true);
`;

// Seed default initial combo charts (if local/database empty)
const DEFAULT_COMBO_CHARTS: ComboChart[] = [
  {
    id: 'combo-sukkari-dates',
    title: 'সৌদি গোল্ডেন সুক্কারি খেজুর স্পেশাল কম্বো',
    price: 1513,
    packageSize: '৩ পিস স্পেশাল কম্বো',
    shape: 'flower',
    isActive: true,
    categoryId: 'organic',
    productIds: ['b3', 'f4', 'n2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'combo-exclusive-sunnah',
    title: 'এক্সক্লুসিভ সুন্নাহ ইবাদত কম্বো',
    price: 4999,
    packageSize: '৪ পিস স্পেশাল সেট',
    shape: 'hexagon',
    isActive: true,
    categoryId: 'gift',
    productIds: ['pj1', 'f1', 'f2', 'f3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'combo-ramadan-special',
    title: 'লাক্সারি আতর ও তসবিহ গিফট প্যাক',
    price: 2450,
    packageSize: '৩ পিস কম্বো',
    shape: 'octagon',
    isActive: true,
    categoryId: 'attar',
    productIds: ['f1', 'n1', 'b2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to get local cache
function getLocalCache(): ComboChart[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => {
          const defaultChart = DEFAULT_COMBO_CHARTS.find((d) => d.id === item.id);
          return {
            ...item,
            shape: item.shape || defaultChart?.shape || 'circle',
          };
        });
      }
    }
  } catch (e) {
    console.warn('Could not read combo charts from localStorage:', e);
  }
  return DEFAULT_COMBO_CHARTS;
}

// Helper to set local cache
function setLocalCache(items: ComboChart[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not write combo charts to localStorage:', e);
  }
}

// Map database row to ComboChart interface
function mapRowToComboChart(row: any): ComboChart {
  return {
    id: String(row.id),
    title: row.title || '',
    price: Number(row.price) || 0,
    packageSize: row.package_size || '',
    isActive: Boolean(row.is_active ?? true),
    shape: row.shape || 'circle',
    categoryId: row.category_id || undefined,
    productIds: Array.isArray(row.product_ids)
      ? row.product_ids
      : typeof row.product_ids === 'string'
      ? JSON.parse(row.product_ids)
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * READ: Fetch all combo charts
 */
export async function fetchAllComboCharts(): Promise<ComboChart[]> {
  const client = getSupabaseClient();
  if (!client) {
    return getLocalCache();
  }

  try {
    const { data, error } = await client
      .from(COMBO_TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase combo_charts query error, using local fallback:', error.message);
      return getLocalCache();
    }

    if (data && data.length > 0) {
      const charts = data.map(mapRowToComboChart);
      setLocalCache(charts);
      return charts;
    }

    // If table exists but empty, return local defaults
    return getLocalCache();
  } catch (err) {
    console.error('Error fetching combo charts:', err);
    return getLocalCache();
  }
}

/**
 * READ: Fetch active combo charts
 */
export async function fetchActiveComboCharts(): Promise<ComboChart[]> {
  const client = getSupabaseClient();
  if (!client) {
    return getLocalCache().filter((c) => c.isActive);
  }

  try {
    const { data, error } = await client
      .from(COMBO_TABLE_NAME)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch active combo_charts error, fallback to local:', error.message);
      return getLocalCache().filter((c) => c.isActive);
    }

    if (data && data.length > 0) {
      return data.map(mapRowToComboChart);
    }

    return getLocalCache().filter((c) => c.isActive);
  } catch (err) {
    console.error('Error fetching active combo charts:', err);
    return getLocalCache().filter((c) => c.isActive);
  }
}

/**
 * READ: Fetch single combo chart by ID
 */
export async function fetchComboChartById(id: string): Promise<ComboChart | null> {
  const client = getSupabaseClient();
  if (!client) {
    const found = getLocalCache().find((c) => c.id === id);
    return found || null;
  }

  try {
    const { data, error } = await client
      .from(COMBO_TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const local = getLocalCache().find((c) => c.id === id);
      return local || null;
    }

    return mapRowToComboChart(data);
  } catch (err) {
    console.error('Error fetching combo chart by id:', err);
    return null;
  }
}

/**
 * CREATE: Create a new Combo Chart
 */
export async function createComboChart(
  input: CreateComboChartInput
): Promise<{ success: boolean; data?: ComboChart; error?: string }> {
  const newId = `combo-${Date.now()}`;
  const now = new Date().toISOString();

  const newChart: ComboChart = {
    id: newId,
    title: input.title.trim(),
    price: Number(input.price) || 0,
    packageSize: input.packageSize,
    shape: input.shape || 'circle',
    isActive: input.isActive ?? true,
    categoryId: input.categoryId?.trim() || undefined,
    productIds: input.productIds || [],
    createdAt: now,
    updatedAt: now,
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from(COMBO_TABLE_NAME)
        .insert({
          title: newChart.title,
          price: newChart.price,
          package_size: String(newChart.packageSize),
          shape: newChart.shape || 'circle',
          is_active: newChart.isActive,
          category_id: newChart.categoryId || null,
          product_ids: newChart.productIds,
        })
        .select()
        .single();

      if (!error && data) {
        const saved = mapRowToComboChart(data);
        const current = getLocalCache();
        setLocalCache([saved, ...current.filter((c) => c.id !== saved.id)]);
        return { success: true, data: saved };
      }
    } catch (e: any) {
      console.warn('Supabase create failed, falling back to local storage:', e?.message);
    }
  }

  // Local fallback
  const current = getLocalCache();
  const updated = [newChart, ...current];
  setLocalCache(updated);
  return { success: true, data: newChart };
}

/**
 * UPDATE: Update existing Combo Chart
 */
export async function updateComboChart(
  id: string,
  input: UpdateComboChartInput
): Promise<{ success: boolean; data?: ComboChart; error?: string }> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (client) {
    try {
      const payload: Record<string, any> = {
        updated_at: now,
      };
      if (input.title !== undefined) payload.title = input.title.trim();
      if (input.price !== undefined) payload.price = Number(input.price);
      if (input.packageSize !== undefined) payload.package_size = String(input.packageSize);
      if (input.shape !== undefined) payload.shape = input.shape;
      if (input.isActive !== undefined) payload.is_active = input.isActive;
      if (input.categoryId !== undefined) payload.category_id = input.categoryId?.trim() || null;
      if (input.productIds !== undefined) payload.product_ids = input.productIds;

      const { data, error } = await client
        .from(COMBO_TABLE_NAME)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToComboChart(data);
        const current = getLocalCache();
        setLocalCache(current.map((c) => (c.id === id ? updated : c)));
        return { success: true, data: updated };
      }
    } catch (e: any) {
      console.warn('Supabase update failed, updating local storage:', e?.message);
    }
  }

  // Local fallback
  const current = getLocalCache();
  let updatedChart: ComboChart | undefined;
  const updatedList = current.map((c) => {
    if (c.id === id) {
      updatedChart = {
        ...c,
        ...input,
        updatedAt: now,
      };
      return updatedChart;
    }
    return c;
  });

  if (!updatedChart) {
    return { success: false, error: 'Combo chart not found' };
  }

  setLocalCache(updatedList);
  return { success: true, data: updatedChart };
}

/**
 * DELETE: Delete a Combo Chart
 */
export async function deleteComboChart(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from(COMBO_TABLE_NAME).delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete warning:', error.message);
      }
    } catch (e: any) {
      console.warn('Supabase delete error:', e?.message);
    }
  }

  const current = getLocalCache();
  setLocalCache(current.filter((c) => c.id !== id));
  return { success: true };
}

/**
 * Helper to resolve productIds to actual Product objects from a catalog
 */
export function resolveComboProducts(productIds: string[], catalog: Product[]): Product[] {
  if (!productIds || !Array.isArray(productIds) || !catalog) return [];
  const map = new Map(catalog.map((p) => [p.id, p]));
  return productIds
    .map((id) => map.get(id))
    .filter((p): p is Product => Boolean(p));
}

/**
 * Convert a ComboChart + resolved products into a unified Product item
 * suitable for adding to Cart / Checkout at the exact combo discounted price.
 */
export function createComboProductItem(chart: ComboChart, products: Product[]): Product {
  const originalTotal = products.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
  const productsSummary = products.map((p) => p.name).join(' + ');

  return {
    id: `combo-${chart.id}`,
    name: chart.title,
    category: chart.categoryId || 'combo',
    price: Number(chart.price),
    originalPrice: originalTotal > chart.price ? originalTotal : undefined,
    image: products[0]?.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&auto=format&fit=crop&q=80',
    images: products.map((p) => p.image),
    rating: 5,
    reviewsCount: 36,
    badge: chart.packageSize ? `কম্বো • ${chart.packageSize}` : 'স্পেশাল কম্বো প্যাকেজ',
    isPopular: true,
    inStock: true,
    description: `প্যাকেজের অন্তর্ভুক্ত পণ্যসমূহ (${products.length}টি): ${productsSummary}`,
    features: products.map((p) => `${p.name} (৳${p.price})`),
    sizes: chart.packageSize ? [String(chart.packageSize)] : undefined,
  };
}
