import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CmsStoreData,
  SiteSettings,
  HeaderNavLink,
  HeroData,
  DualBannerData,
  TrustItem,
  PolicyData,
  SupabaseConfig,
  CustomerOrder,
  OrderStatus,
  CategoryShowcaseBanner,
  ShowroomStripData,
} from '../types/cms';
import type { Product, Category, Testimonial } from '../types';
import { DEFAULT_CMS_DATA } from '../data/defaultCmsData';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  fetchCmsDataFromSupabase,
  saveCmsDataToSupabase,
} from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'iqrshop_cms_store_v1';
const ADMIN_SESSION_KEY = 'iqrshop_admin_auth_v1';

// Admin Credentials
const ADMIN_EMAILS = ['khanabir42@gmial.com', 'khanabir42@gmail.com'];
const ADMIN_PASS = '123456Ak@#';

interface CmsContextType {
  data: CmsStoreData;
  supabaseConfig: SupabaseConfig;
  isAdminLoggedIn: boolean;
  isLoading: boolean;
  isSaving: boolean;
  
  // Admin Auth
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Partial Updaters
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateHeaderNavLinks: (links: HeaderNavLink[]) => void;
  updateHeroData: (hero: Partial<HeroData>) => void;
  updateDualBanners: (banners: Partial<DualBannerData>) => void;
  updateTrustItems: (items: TrustItem[]) => void;
  updatePolicies: (policies: Partial<PolicyData>) => void;
  updateCategoryBanners: (banners: CategoryShowcaseBanner[]) => void;
  updateSingleCategoryBanner: (bannerId: string, banner: Partial<CategoryShowcaseBanner>) => void;
  updateShowroomStrip: (strip: Partial<ShowroomStripData>) => void;
  
  // Product CRUD
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Category CRUD
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Testimonials CRUD
  addTestimonial: (testim: Testimonial) => void;
  updateTestimonial: (testim: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  // Order & Customer Management
  createOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateOrder: (order: CustomerOrder) => void;

  // Supabase & Storage Actions
  updateSupabaseConfig: (config: SupabaseConfig) => void;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
  fetchFromSupabase: () => Promise<{ success: boolean; message: string }>;
  exportBackupJson: () => void;
  importBackupJson: (fileContent: string) => boolean;
  resetToDefaults: () => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CmsStoreData>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          siteSettings: { ...DEFAULT_CMS_DATA.siteSettings, ...(parsed.siteSettings || {}) },
          heroData: { ...DEFAULT_CMS_DATA.heroData, ...(parsed.heroData || {}) },
          dualBanners: { ...DEFAULT_CMS_DATA.dualBanners, ...(parsed.dualBanners || {}) },
          policies: { ...DEFAULT_CMS_DATA.policies, ...(parsed.policies || {}) },
          orders: Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : DEFAULT_CMS_DATA.orders,
          categoryBanners: Array.isArray(parsed.categoryBanners) && parsed.categoryBanners.length > 0 ? parsed.categoryBanners : DEFAULT_CMS_DATA.categoryBanners,
          showroomStrip: { ...DEFAULT_CMS_DATA.showroomStrip, ...(parsed.showroomStrip || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to load local CMS store:', e);
    }
    return DEFAULT_CMS_DATA;
  });

  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getStoredSupabaseConfig);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Save to LocalStorage whenever data changes
  const saveToLocal = useCallback((newData: CmsStoreData) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to persist CMS data to localStorage:', e);
    }
  }, []);

  // Sync with Supabase on initial load if configured
  useEffect(() => {
    async function loadCloudData() {
      if (supabaseConfig.url && supabaseConfig.anonKey) {
        setIsLoading(true);
        const cloudData = await fetchCmsDataFromSupabase();
        if (cloudData) {
          setData((prev) => {
            const merged = {
              ...prev,
              ...cloudData,
              siteSettings: { ...prev.siteSettings, ...(cloudData.siteSettings || {}) },
              heroData: { ...prev.heroData, ...(cloudData.heroData || {}) },
              dualBanners: { ...prev.dualBanners, ...(cloudData.dualBanners || {}) },
              policies: { ...prev.policies, ...(cloudData.policies || {}) },
              orders: Array.isArray(cloudData.orders) && cloudData.orders.length > 0 ? cloudData.orders : prev.orders,
            };
            saveToLocal(merged);
            return merged;
          });
        }
        setIsLoading(false);
      }
    }
    loadCloudData();
  }, [supabaseConfig.url, supabaseConfig.anonKey, saveToLocal]);

  // Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (ADMIN_EMAILS.includes(cleanEmail) && cleanPass === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Updaters
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setData((prev) => {
      const updated = { ...prev, siteSettings: { ...prev.siteSettings, ...settings } };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateHeaderNavLinks = (links: HeaderNavLink[]) => {
    setData((prev) => {
      const updated = { ...prev, headerNavLinks: links };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateHeroData = (hero: Partial<HeroData>) => {
    setData((prev) => {
      const updated = { ...prev, heroData: { ...prev.heroData, ...hero } };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateDualBanners = (banners: Partial<DualBannerData>) => {
    setData((prev) => {
      const updated = { ...prev, dualBanners: { ...prev.dualBanners, ...banners } };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateTrustItems = (items: TrustItem[]) => {
    setData((prev) => {
      const updated = { ...prev, trustItems: items };
      saveToLocal(updated);
      return updated;
    });
  };

  const updatePolicies = (policies: Partial<PolicyData>) => {
    setData((prev) => {
      const updated = { ...prev, policies: { ...prev.policies, ...policies } };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateCategoryBanners = (banners: CategoryShowcaseBanner[]) => {
    setData((prev) => {
      const updated = { ...prev, categoryBanners: banners };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateSingleCategoryBanner = (bannerId: string, banner: Partial<CategoryShowcaseBanner>) => {
    setData((prev) => {
      const updatedBanners = prev.categoryBanners.map((b) =>
        b.id === bannerId ? { ...b, ...banner } : b
      );
      const updated = { ...prev, categoryBanners: updatedBanners };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateShowroomStrip = (strip: Partial<ShowroomStripData>) => {
    setData((prev) => {
      const updated = { ...prev, showroomStrip: { ...prev.showroomStrip, ...strip } };
      saveToLocal(updated);
      return updated;
    });
  };

  // Product CRUD
  const addProduct = (product: Product) => {
    setData((prev) => {
      const updated = { ...prev, products: [product, ...prev.products] };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateProduct = (product: Product) => {
    setData((prev) => {
      const updated = {
        ...prev,
        products: prev.products.map((p) => (p.id === product.id ? product : p)),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  // Category CRUD
  const addCategory = (category: Category) => {
    setData((prev) => {
      const updated = { ...prev, categories: [...prev.categories, category] };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateCategory = (category: Category) => {
    setData((prev) => {
      const updated = {
        ...prev,
        categories: prev.categories.map((c) => (c.id === category.id ? category : c)),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  const deleteCategory = (categoryId: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        categories: prev.categories.filter((c) => c.id !== categoryId),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  // Testimonials CRUD
  const addTestimonial = (testim: Testimonial) => {
    setData((prev) => {
      const updated = { ...prev, testimonials: [testim, ...prev.testimonials] };
      saveToLocal(updated);
      return updated;
    });
  };

  const updateTestimonial = (testim: Testimonial) => {
    setData((prev) => {
      const updated = {
        ...prev,
        testimonials: prev.testimonials.map((t) => (t.id === testim.id ? testim : t)),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        testimonials: prev.testimonials.filter((t) => t.id !== id),
      };
      saveToLocal(updated);
      return updated;
    });
  };

  // Order & Customer Management
  const createOrder = (order: CustomerOrder) => {
    setData((prev) => {
      const updatedOrders = [order, ...(prev.orders || [])];
      const updatedData = { ...prev, orders: updatedOrders };
      saveToLocal(updatedData);
      
      // Also silently attempt to sync to Supabase if connected
      if (supabaseConfig.url && supabaseConfig.anonKey) {
        saveCmsDataToSupabase(updatedData).catch(console.error);
      }
      return updatedData;
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setData((prev) => {
      const updatedOrders = (prev.orders || []).map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
      const updatedData = { ...prev, orders: updatedOrders };
      saveToLocal(updatedData);
      return updatedData;
    });
  };

  const updateOrder = (order: CustomerOrder) => {
    setData((prev) => {
      const updatedOrders = (prev.orders || []).map((o) =>
        o.id === order.id ? order : o
      );
      const updatedData = { ...prev, orders: updatedOrders };
      saveToLocal(updatedData);
      return updatedData;
    });
  };

  const deleteOrder = (orderId: string) => {
    setData((prev) => {
      const updatedOrders = (prev.orders || []).filter((o) => o.id !== orderId);
      const updatedData = { ...prev, orders: updatedOrders };
      saveToLocal(updatedData);
      return updatedData;
    });
  };

  // Supabase Config and Sync
  const updateSupabaseConfig = (config: SupabaseConfig) => {
    setSupabaseConfigState(config);
    saveSupabaseConfig(config);
  };

  const syncWithSupabase = async () => {
    setIsSaving(true);
    const result = await saveCmsDataToSupabase(data);
    if (result.success) {
      const newCfg = { ...supabaseConfig, isConnected: true, lastSyncedAt: new Date().toLocaleTimeString('bn-BD') };
      setSupabaseConfigState(newCfg);
      saveSupabaseConfig(newCfg);
    }
    setIsSaving(false);
    return result;
  };

  const fetchFromSupabase = async () => {
    setIsLoading(true);
    const cloudData = await fetchCmsDataFromSupabase();
    setIsLoading(false);
    if (cloudData) {
      setData(cloudData);
      saveToLocal(cloudData);
      return { success: true, message: 'Supabase থেকে ডাটা সফলভাবে রিফ্রেশ হয়েছে!' };
    }
    return { success: false, message: 'Supabase থেকে ডাটা পাওয়া যায়নি বা কানেকশন ত্রুটি।' };
  };

  // Export JSON Backup
  const exportBackupJson = () => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iqrshop_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // Import JSON Backup
  const importBackupJson = (fileContent: string): boolean => {
    try {
      const parsed = JSON.parse(fileContent);
      if (parsed && parsed.siteSettings && parsed.products) {
        setData(parsed);
        saveToLocal(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return false;
  };

  // Reset To Default
  const resetToDefaults = () => {
    setData(DEFAULT_CMS_DATA);
    saveToLocal(DEFAULT_CMS_DATA);
  };

  return (
    <CmsContext.Provider
      value={{
        data,
        supabaseConfig,
        isAdminLoggedIn,
        isLoading,
        isSaving,
        loginAdmin,
        logoutAdmin,
        updateSiteSettings,
        updateHeaderNavLinks,
        updateHeroData,
        updateDualBanners,
        updateTrustItems,
        updatePolicies,
        updateCategoryBanners,
        updateSingleCategoryBanner,
        updateShowroomStrip,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        updateOrder,
        updateSupabaseConfig,
        syncWithSupabase,
        fetchFromSupabase,
        exportBackupJson,
        importBackupJson,
        resetToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
