import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Menu,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Star,
  Settings,
  Database,
  Save,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Eye,
  Layers,
  ClipboardList,
  Search,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  MapPin,
  ChevronDown,
  Check,
  ArrowUp,
  ArrowDown,
  EyeOff,
  PieChart,
  X,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { ImageUploadField } from './ImageUploadField';
import { ProductEditModal } from './ProductEditModal';
import { OrderInvoiceModal } from './OrderInvoiceModal';
import { SUPABASE_SQL_SCHEMA, testSupabaseConnection } from '../../lib/supabase';
import { 
  createComboChart, 
  fetchAllComboCharts, 
  updateComboChart, 
  deleteComboChart 
} from '../../lib/comboChartService';
import { PERMANENT_SUPABASE_CONFIG } from '../../config/supabaseConfig';
import { DEFAULT_HOME_SECTIONS, DEFAULT_HEADER_NAV_LINKS } from '../../data/defaultCmsData';
import { CATEGORIES } from '../../data/products';
import type { Product, ComboChart, ComboChartShape } from '../../types';
import type { CustomerOrder, OrderStatus, HomeSectionItem } from '../../types/cms';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'orders'
  | 'combo'
  | 'sections'
  | 'header'
  | 'hero'
  | 'products'
  | 'trust'
  | 'reviews'
  | 'footer'
  | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    data,
    supabaseConfig,
    isSaving,
    isLoading,
    logoutAdmin,
    updateSiteSettings,
    updateHeaderNavLinks,
    updateHeroData,
    updatePolicies,
    updateCategoryBanners,
    updateShowroomStrip,
    updateHomeSections,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateOrderStatus,
    deleteOrder,
    updateSupabaseConfig,
    syncWithSupabase,
    fetchFromSupabase,
    exportBackupJson,
    importBackupJson,
    resetToDefaults,
  } = useCms();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string>('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Order Details / Invoice Modal State
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Orders Filter & Search State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Local state copies for live editing tabs
  const [localSettings, setLocalSettings] = useState(data.siteSettings);
  const [localHero, setLocalHero] = useState(data.heroData);
  const [localPolicies, setLocalPolicies] = useState(data.policies);
  const [localNavLinks, setLocalNavLinks] = useState(data.headerNavLinks);
  const [localCategoryBanners, setLocalCategoryBanners] = useState(
    Array.isArray(data.categoryBanners) && data.categoryBanners.length > 0
      ? data.categoryBanners
      : []
  );
  const [localShowroomStrip, setLocalShowroomStrip] = useState(
    data.showroomStrip || {
      title: 'এক্সক্লুসিভ শোরুম ও স্পেশাল গিফট কালেকশন',
      badge: 'GIFT SPECIAL',
      subtitle: 'প্রিয়জনকে উপহার দিতে প্রিমিয়াম বক্স প্যাকেজিং ও সারাদেশে দ্রুত হোম ডেলিভারি',
      buttonText: 'গিফট প্যাকেজ দেখুন',
      categoryId: 'gift',
      enabled: true,
    }
  );

  // Home Sections Ordering & Visibility
  const [localHomeSections, setLocalHomeSections] = useState<HomeSectionItem[]>(() => {
    if (data.homeSections && data.homeSections.length > 0) {
      return [...data.homeSections].sort((a, b) => a.order - b.order);
    }
    return DEFAULT_HOME_SECTIONS;
  });

  // Supabase inputs
  const [dbUrl, setDbUrl] = useState(
    supabaseConfig.url || PERMANENT_SUPABASE_CONFIG.url || ''
  );
  const [dbKey, setDbKey] = useState(
    supabaseConfig.anonKey || PERMANENT_SUPABASE_CONFIG.anonKey || ''
  );
  const [dbTestResult, setDbTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync inputs if supabaseConfig changes
  useEffect(() => {
    if (supabaseConfig.url) {
      setDbUrl(supabaseConfig.url);
    } else if (PERMANENT_SUPABASE_CONFIG.url) {
      setDbUrl(PERMANENT_SUPABASE_CONFIG.url);
    }

    if (supabaseConfig.anonKey) {
      setDbKey(supabaseConfig.anonKey);
    } else if (PERMANENT_SUPABASE_CONFIG.anonKey) {
      setDbKey(PERMANENT_SUPABASE_CONFIG.anonKey);
    }
  }, [supabaseConfig.url, supabaseConfig.anonKey]);

  // New Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('✨');

  // Combo Charts Database State
  const [comboChartsList, setComboChartsList] = useState<ComboChart[]>([]);
  const [isComboFormModalOpen, setIsComboFormModalOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);
  const [comboProductCategoryFilter, setComboProductCategoryFilter] = useState('all');
  const [comboProductSearch, setComboProductSearch] = useState('');
  const [comboFormData, setComboFormData] = useState({
    title: '',
    price: 0,
    packageSize: '৩ পিস স্পেশাল কম্বো',
    shape: 'circle' as ComboChartShape,
    categoryId: 'all',
    isActive: true,
    productIds: [] as string[],
  });

  const [copiedComboId, setCopiedComboId] = useState<string | null>(null);

  const handleCopyComboLink = (comboId: string) => {
    const url = `${window.location.origin}/?combo=${comboId}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedComboId(comboId);
        notifySuccess('ফেসবুক বুস্টিং লিংক ক্লিপবোর্ডে কপি হয়েছে!');
        setTimeout(() => setCopiedComboId(null), 3500);
      });
    } else {
      notifySuccess(`লিংক: ${url}`);
    }
  };

  const loadComboCharts = () => {
    fetchAllComboCharts().then((list) => {
      setComboChartsList(list);
    });
  };

  useEffect(() => {
    loadComboCharts();
  }, []);

  const handleOpenAddCombo = () => {
    setEditingComboId(null);
    setComboFormData({
      title: '',
      price: 0,
      packageSize: '৩ পিস স্পেশাল কম্বো',
      shape: 'circle' as ComboChartShape,
      categoryId: 'all',
      isActive: true,
      productIds: [],
    });
    setComboProductCategoryFilter('all');
    setComboProductSearch('');
    setIsComboFormModalOpen(true);
  };

  const handleOpenEditCombo = (chart: ComboChart) => {
    setEditingComboId(chart.id);
    setComboFormData({
      title: chart.title,
      price: chart.price,
      packageSize: String(chart.packageSize),
      shape: (chart.shape || 'circle') as ComboChartShape,
      categoryId: chart.categoryId || 'all',
      isActive: chart.isActive,
      productIds: [...chart.productIds],
    });
    setComboProductCategoryFilter('all');
    setComboProductSearch('');
    setIsComboFormModalOpen(true);
  };

  const handleSaveCombo = async () => {
    if (!comboFormData.title.trim()) {
      notifyError('কম্বো চার্ট টাইটেল প্রদান করুন।');
      return;
    }
    if (comboFormData.productIds.length === 0) {
      notifyError('কম্বোতে অন্তত ১টি বা ততোধিক প্রোডাক্ট নির্বাচন করুন।');
      return;
    }

    if (editingComboId) {
      const res = await updateComboChart(editingComboId, {
        title: comboFormData.title.trim(),
        price: Number(comboFormData.price),
        packageSize: comboFormData.packageSize.trim(),
        shape: comboFormData.shape,
        categoryId: comboFormData.categoryId !== 'all' ? comboFormData.categoryId : undefined,
        isActive: comboFormData.isActive,
        productIds: comboFormData.productIds,
      });
      if (res.success) {
        notifySuccess('কম্বো চার্ট সফলভাবে আপডেট হয়েছে!');
      }
    } else {
      const res = await createComboChart({
        title: comboFormData.title.trim(),
        price: Number(comboFormData.price),
        packageSize: comboFormData.packageSize.trim(),
        shape: comboFormData.shape,
        categoryId: comboFormData.categoryId !== 'all' ? comboFormData.categoryId : undefined,
        isActive: comboFormData.isActive,
        productIds: comboFormData.productIds,
      });
      if (res.success) {
        notifySuccess('নতুন কম্বো চার্ট ডাটাবেসে সফলভাবে যুক্ত হয়েছে!');
      }
    }
    loadComboCharts();
    setIsComboFormModalOpen(false);
  };

  const handleToggleComboActive = async (chart: ComboChart) => {
    await updateComboChart(chart.id, { isActive: !chart.isActive });
    loadComboCharts();
    notifySuccess(`কম্বো চার্ট ${!chart.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে!`);
  };

  const handleDeleteCombo = async (id: string) => {
    if (window.confirm('আপনি কি এই কম্বো চার্টটি ডাটাবেস থেকে মুছে ফেলতে চান?')) {
      await deleteComboChart(id);
      loadComboCharts();
      notifySuccess('কম্বো চার্ট সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  // Helper for notification
  const notifySuccess = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorNotice(msg);
    setTimeout(() => setErrorNotice(''), 5000);
  };

  // Orders Calculations
  const ordersList = useMemo(() => data.orders || [], [data.orders]);
  const pendingOrdersCount = ordersList.filter((o) => o.status === 'pending').length;
  const deliveredOrdersCount = ordersList.filter((o) => o.status === 'delivered').length;
  const totalRevenue = ordersList
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      // Status Filter
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      // Search Filter
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.customerAddress.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ordersList, orderStatusFilter, orderSearch]);

  // Export Orders to CSV
  const handleExportOrdersCsv = () => {
    try {
      const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Area', 'Items', 'Total Amount', 'Status', 'Payment'];
      const rows = ordersList.map((o) => [
        o.id,
        new Date(o.createdAt).toLocaleDateString('en-GB'),
        `"${o.customerName.replace(/"/g, '""')}"`,
        o.customerPhone,
        `"${o.customerAddress.replace(/"/g, '""')}"`,
        o.deliveryArea,
        `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}"`,
        o.totalAmount,
        o.status,
        o.paymentMethod,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iqrshop_orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notifySuccess('অর্ডার ডেটাবেস সফলভাবে CSV ফাইল হিসেবে ডাউনলোড হয়েছে!');
    } catch (e) {
      console.error(e);
      notifyError('CSV এক্সপোর্ট করতে সমস্যা হয়েছে।');
    }
  };

  // Save changes handler for standard forms
  const handleSaveSettings = () => {
    updateSiteSettings(localSettings);
    notifySuccess('হেডার ও সাধারণ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveHero = () => {
    updateHeroData(localHero);
    updateCategoryBanners(localCategoryBanners);
    updateShowroomStrip(localShowroomStrip);
    notifySuccess('হিরো ব্যানার, শোরুম স্ট্রিপ ও ক্যাটাগরি শোকেস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSavePolicies = () => {
    updatePolicies(localPolicies);
    notifySuccess('পলিসি ও গ্যারান্টি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveNavLinks = () => {
    updateHeaderNavLinks(localNavLinks);
    notifySuccess('মেনু লিংকসমূহ সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Header Navigation Reordering & Visibility Handlers
  const moveNavLinkUp = (index: number) => {
    if (index <= 0) return;
    setLocalNavLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveNavLinkDown = (index: number) => {
    if (index >= localNavLinks.length - 1) return;
    setLocalNavLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const toggleNavLinkEnabled = (index: number) => {
    setLocalNavLinks((prev) => {
      const copy = [...prev];
      const current = copy[index];
      const isCurrentlyEnabled = current.enabled !== false;
      copy[index] = {
        ...current,
        enabled: !isCurrentlyEnabled,
      };
      return copy;
    });
  };

  const toggleNavLinkSparkle = (index: number) => {
    setLocalNavLinks((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        showSparkle: !copy[index].showSparkle,
      };
      return copy;
    });
  };

  const handleResetNavLinks = () => {
    if (window.confirm('আপনি কি হেডার মেনুর তালিকা ও ক্রম মূল ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
      setLocalNavLinks(DEFAULT_HEADER_NAV_LINKS);
      updateHeaderNavLinks(DEFAULT_HEADER_NAV_LINKS);
      notifySuccess('হেডার মেনু সফলভাবে মূল ডিফল্ট অবস্থায় রিস্টোর হয়েছে!');
    }
  };

  // Section Reordering Handlers
  const moveSectionUp = (index: number) => {
    if (index <= 0) return;
    setLocalHomeSections((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy.map((sec, i) => ({ ...sec, order: i + 1 }));
    });
  };

  const moveSectionDown = (index: number) => {
    if (index >= localHomeSections.length - 1) return;
    setLocalHomeSections((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy.map((sec, i) => ({ ...sec, order: i + 1 }));
    });
  };

  const toggleSectionEnabled = (sectionId: string) => {
    setLocalHomeSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  const moveCategoryBannerUp = (index: number) => {
    if (index <= 0) return;
    setLocalCategoryBanners((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveCategoryBannerDown = (index: number) => {
    if (index >= localCategoryBanners.length - 1) return;
    setLocalCategoryBanners((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const toggleCategoryBannerEnabled = (bannerId: string) => {
    setLocalCategoryBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, enabled: b.enabled === false ? true : false } : b))
    );
  };

  const handleSaveSections = () => {
    updateHomeSections(localHomeSections);
    updateCategoryBanners(localCategoryBanners);
    notifySuccess('হোমপেজ সেকশন ও ক্যাটাগরির নতুন ক্রম সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleResetSections = () => {
    if (window.confirm('আপনি কি সেকশনের ক্রম মূল ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
      setLocalHomeSections(DEFAULT_HOME_SECTIONS);
      updateHomeSections(DEFAULT_HOME_SECTIONS);
      notifySuccess('সেকশনের ক্রম সফলভাবে ডিফল্ট সেটিংসে রিস্টোর হয়েছে!');
    }
  };

  // Supabase Test & Save
  const handleTestDb = async () => {
    setDbTestResult({ message: 'কানেকশন টেস্ট করা হচ্ছে...' });
    const res = await testSupabaseConnection(dbUrl, dbKey);
    setDbTestResult(res);
  };

  const handleSaveDbConfig = () => {
    updateSupabaseConfig({
      url: dbUrl.trim(),
      anonKey: dbKey.trim(),
      isConnected: true,
    });
    notifySuccess('Supabase তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSyncToSupabase = async () => {
    const res = await syncWithSupabase();
    if (res.success) {
      notifySuccess(res.message);
    } else {
      notifyError(res.message);
    }
  };

  const handleFetchFromSupabase = async () => {
    const res = await fetchFromSupabase();
    if (res.success) {
      setLocalSettings(data.siteSettings);
      setLocalHero(data.heroData);
      setLocalPolicies(data.policies);
      if (data.headerNavLinks) setLocalNavLinks(data.headerNavLinks);
      if (data.categoryBanners) setLocalCategoryBanners(data.categoryBanners);
      if (data.showroomStrip) setLocalShowroomStrip(data.showroomStrip);
      if (data.homeSections) {
        setLocalHomeSections([...data.homeSections].sort((a, b) => a.order - b.order));
      }
      notifySuccess(res.message);
    } else {
      notifyError(res.message);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          const success = importBackupJson(text);
          if (success) {
            notifySuccess('ব্যাকআপ ফাইল থেকে পুরো সাইট সফলভাবে রিস্টোর হয়েছে!');
          } else {
            notifyError('অবৈধ ব্যাকআপ ফাইল। সঠিক JSON ফাইল নির্বাচন করুন।');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত পরিবর্তন মুছে ডিফল্ট অবস্থায় ফিরে যেতে চান?')) {
      resetToDefaults();
      notifySuccess('সাইট সফলভাবে ডিফল্ট অবস্থায় ফিরে গেছে!');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  const navTabs = [
    { id: 'overview', name: 'ওভারভিউ ও স্ট্যাটস', icon: LayoutDashboard },
    { id: 'orders', name: `অর্ডার ও কাস্টমার (${ordersList.length})`, icon: ClipboardList, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'combo', name: `কম্বো চার্ট প্যাকেজ (${comboChartsList.length})`, icon: PieChart },
    { id: 'sections', name: 'সেকশন সাজানো (Section Order)', icon: Layers },
    { id: 'header', name: 'হেডার ও মেনু', icon: Menu },
    { id: 'hero', name: 'হিরো ও ব্যানার', icon: Sparkles },
    { id: 'products', name: `প্রোডাক্টস (${data.products.length})`, icon: ShoppingBag },
    { id: 'trust', name: 'ট্রাস্ট ও পলিসি সেটিংস', icon: ShieldCheck },
    { id: 'reviews', name: `রিভিউ (${data.testimonials.length})`, icon: Star },
    { id: 'footer', name: 'ফুটার ও কন্টাক্ট ইনফো', icon: Settings },
    { id: 'database', name: 'Supabase ও ক্লাউড সিঙ্ক', icon: Database },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-800 flex flex-col overflow-hidden font-sans">
      
      {/* Top Header / Action Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-xs">
            {data.siteSettings.logoIcon || '☪'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {data.siteSettings.siteName} <span className="text-emerald-700 font-extrabold">CMS & Orders Studio</span>
              </h1>
              <span className="text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                সুপার অ্যাডমিন
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">কাস্টমার অর্ডার, কন্টেন্ট ও ওয়েবসাইট কন্ট্রোল সিস্টেম</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSyncToSupabase}
            disabled={isSaving}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            title="ক্লাউড ডাটাবেসে সেভ করুন"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSaving ? 'সিঙ্ক হচ্ছে...' : 'Supabase সিঙ্ক'}</span>
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-200"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>সাইট প্রিভিউ</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              onClose();
            }}
            className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Clean Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-3 md:p-4 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1 shadow-2xs">
          <div className="hidden md:block px-3 py-1.5 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            কন্ট্রোল মেনু
          </div>

          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap text-left ${
                  isActive
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{tab.name}</span>
                </div>
                {tab.badge && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden md:block mt-auto pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">💡 কাস্টমার কল টিপ:</span>
              <p>অর্ডার আসার পর ১ ক্লিকে WhatsApp বা ফোন কলের মাধ্যমে কাস্টমারকে কনফার্ম করুন।</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-50/80 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Notifications */}
          {successNotice && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-rose-900 text-xs sm:text-sm font-bold shadow-xs animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* 1. OVERVIEW TAB */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">ড্যাশবোর্ড ওভারভিউ</h2>
                <p className="text-xs sm:text-sm text-slate-500">আপনার অনলাইন শপের বর্তমান অর্ডার ও কন্টেন্ট পরিসংখ্যান</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 space-y-1.5 shadow-xs cursor-pointer transition"
                >
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">মোট কাস্টমার অর্ডার</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{ordersList.length} টি</div>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    ✓ অর্ডার লিস্ট দেখুন
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setOrderStatusFilter('pending');
                    setActiveTab('orders');
                  }}
                  className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-5 space-y-1.5 shadow-xs cursor-pointer transition"
                >
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">নতুন অপেক্ষমাণ (Pending)</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">{pendingOrdersCount} টি</div>
                  <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                    {pendingOrdersCount > 0 ? '⚠️ কল দিয়ে কনফার্ম করুন' : 'সব প্রসেসড'}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">মোট বিক্রয় (Revenue)</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800">৳{totalRevenue}</div>
                  <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                    {deliveredOrdersCount} টি ডেলিভার্ড অর্ডার
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">ডাটাবেস স্ট্যাটাস</span>
                  <div className="text-base sm:text-lg font-black text-emerald-700 flex items-center gap-1.5 pt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{supabaseConfig.isConnected ? 'কানেক্টেড' : 'সক্রিয় (লোকাল)'}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 block truncate">
                    {supabaseConfig.lastSyncedAt ? `শেষ সিঙ্ক: ${supabaseConfig.lastSyncedAt}` : 'অটো সেভ মোড'}
                  </span>
                </div>
              </div>

              {/* Recent Orders Preview Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-emerald-700" />
                    <span>লেটেস্ট কাস্টমার অর্ডারসমূহ</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  >
                    সব অর্ডার দেখুন →
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">এখনও কোনো অর্ডার পাওয়া যায়নি।</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {ordersList.slice(0, 4).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-800">{order.id}</span>
                            <span className="font-bold text-slate-900">{order.customerName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({order.customerPhone})</span>
                          </div>
                          <p className="text-slate-500 text-[11px] pt-0.5">{order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold font-mono text-slate-900 text-sm">৳{order.totalAmount}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status === 'pending' ? 'অপেক্ষমাণ' : order.status === 'confirmed' ? 'নিশ্চিত' : order.status === 'delivered' ? 'ডেলিভার্ড' : order.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="বিস্তারিত ও চালান দেখুন"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Guide Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  <span>সাইট ও কাস্টমার পরিচালনা গাইড</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <b className="text-slate-900 text-sm block">১. কাস্টমার অর্ডার প্রসেসিং:</b>
                    <p className="leading-relaxed">
                      <b>"অর্ডার ও কাস্টমার"</b> ট্যাবে গিয়ে ১ ক্লিকে কাস্টমারকে WhatsApp-এ মেসেজ দিন বা কল করে অর্ডার কনফার্ম করুন।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <b className="text-slate-900 text-sm block">২. ইনভয়েস ও চালান প্রিন্ট:</b>
                    <p className="leading-relaxed">
                      প্রতিটি অর্ডারের পাশে থাকা <b>ইনভয়েস আইকনে</b> চাপ দিলে পূর্ণাঙ্গ গ্রাহক চালান দেখা যাবে এবং প্রিন্ট করা যাবে।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <b className="text-slate-900 text-sm block">৩. প্রোডাক্ট ও ব্যানার আপডেট:</b>
                    <p className="leading-relaxed">
                      সাইটের টেক্সট, ফটো ও মূল্য পরিবর্তন করতে মেনু থেকে <b>হিরো ও ব্যানার</b> বা <b>প্রোডাক্টস</b> ট্যাবে যান।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. ORDERS & CUSTOMERS MANAGEMENT TAB */}
          {/* ==================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              {/* Header with Title and Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                      <ClipboardList className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                        <span>কাস্টমার ও অর্ডার ম্যানেজমেন্ট</span>
                        {pendingOrdersCount > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                            {pendingOrdersCount} টি নতুন
                          </span>
                        )}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 pt-0.5">
                        সকল কাস্টমারের সাথে দ্রুত যোগাযোগ করুন, অর্ডারের স্থিতি পরিচালনা করুন এবং চালান প্রিন্ট করুন
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleExportOrdersCsv}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold transition cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>CSV / Excel এক্সপোর্ট</span>
                  </button>
                </div>
              </div>

              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs hover:border-emerald-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">মোট অর্ডার</span>
                    <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold">
                      📦
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                    {ordersList.length}
                  </div>
                  <span className="text-xs text-slate-400 block">সর্বমোট সংগৃহীত অর্ডার</span>
                </div>

                <div className="bg-gradient-to-br from-amber-50/70 to-white border border-amber-200/80 rounded-2xl p-5 space-y-2 shadow-xs hover:border-amber-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">অপেক্ষমাণ নতুন</span>
                    <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-base font-bold">
                      ⏳
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-900 font-mono">
                    {pendingOrdersCount}
                  </div>
                  <span className="text-xs text-amber-700 font-semibold block">কল/মেসেজ দিয়ে কনফার্ম করুন</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs hover:border-blue-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">কনফার্মড ও ডেলিভার্ড</span>
                    <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base font-bold">
                      🚚
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono">
                    {ordersList.filter((o) => o.status === 'confirmed' || o.status === 'shipped' || o.status === 'delivered').length}
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold block">সফলভাবে প্রসেসকৃত অর্ডার</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-200/80 rounded-2xl p-5 space-y-2 shadow-xs hover:border-emerald-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-900 uppercase tracking-wider">মোট বিক্রয় (Revenue)</span>
                    <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base font-bold">
                      ৳
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-900 font-mono">
                    ৳{totalRevenue.toLocaleString('en-BD')}
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold block">কার্যকর মোট অর্ডার ভ্যালু</span>
                </div>
              </div>

              {/* Status Filter Tabs & Search Bar */}
              <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
                  {/* Status Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {[
                      { id: 'all', label: 'সব অর্ডার', icon: '📦', count: ordersList.length },
                      { id: 'pending', label: 'অপেক্ষমাণ', icon: '⏳', count: ordersList.filter((o) => o.status === 'pending').length, alert: pendingOrdersCount > 0 },
                      { id: 'confirmed', label: 'কনফার্মড', icon: '✓', count: ordersList.filter((o) => o.status === 'confirmed').length },
                      { id: 'shipped', label: 'শিপমেন্টে', icon: '🚚', count: ordersList.filter((o) => o.status === 'shipped').length },
                      { id: 'delivered', label: 'ডেলিভার্ড', icon: '🎉', count: ordersList.filter((o) => o.status === 'delivered').length },
                      { id: 'cancelled', label: 'বাতিল', icon: '✕', count: ordersList.filter((o) => o.status === 'cancelled').length },
                    ].map((tab) => {
                      const isActive = orderStatusFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setOrderStatusFilter(tab.id as any)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                            isActive
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                          }`}
                        >
                          <span className="text-base">{tab.icon}</span>
                          <span>{tab.label}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : tab.alert
                                ? 'bg-amber-200 text-amber-950'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full lg:w-80 shrink-0">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="অর্ডার আইডি, নাম, ফোন বা ঠিকানা..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
                    />
                    {orderSearch && (
                      <button
                        onClick={() => setOrderSearch('')}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
                        title="সার্চ ক্লিয়ার করুন"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Orders List Table Container */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-20 px-4 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                      🔍
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">কোনো অর্ডার পাওয়া যায়নি!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      {orderSearch
                        ? `"${orderSearch}" এর সাথে কোনো অর্ডার মিলেনি। দয়া করে অন্য কোনো কীওয়ার্ড লিখে খুঁজুন।`
                        : 'এই স্ট্যাটাসে বর্তমানে কোনো অর্ডার নেই।'}
                    </p>
                    {(orderSearch || orderStatusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setOrderSearch('');
                          setOrderStatusFilter('all');
                        }}
                        className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition cursor-pointer"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                      <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-xs">
                        <tr>
                          <th className="p-4.5 pl-6">অর্ডার আইডি ও সময়</th>
                          <th className="p-4.5">গ্রাহকের তথ্য ও তাৎক্ষণিক যোগাযোগ</th>
                          <th className="p-4.5">ডেলিভারি ঠিকানা ও জোন</th>
                          <th className="p-4.5">অর্ডারকৃত পণ্য তালিকা</th>
                          <th className="p-4.5">মূল্য ও পেমেন্ট</th>
                          <th className="p-4.5">অর্ডার স্ট্যাটাস</th>
                          <th className="p-4.5 pr-6 text-right">চালান ও অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => {
                          const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                          const waPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
                          const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                            `আসসালামু আলাইকুম ${order.customerName} সাহেব, আপনার ${order.id} নম্বর অর্ডারের বিষয়ে ${data.siteSettings.siteName} থেকে যোগাযোগ করা হচ্ছে। মোট মূল্য: ৳${order.totalAmount}।`
                          )}`;

                          // Generate customer initials
                          const nameParts = order.customerName.trim().split(' ');
                          const initials = nameParts.length > 1 
                            ? `${nameParts[0][0] || ''}${nameParts[1][0] || ''}`
                            : order.customerName.slice(0, 2);

                          const isCopied = copiedOrderId === order.id;

                          return (
                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                              {/* 1. Order ID & Date */}
                              <td className="p-4.5 pl-6 align-top">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.id);
                                        setCopiedOrderId(order.id);
                                        setTimeout(() => setCopiedOrderId(null), 2000);
                                      }}
                                      className="font-mono font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 transition cursor-pointer"
                                      title="অর্ডার আইডি কপি করুন"
                                    >
                                      <span>#{order.id}</span>
                                      {isCopied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100" />
                                      )}
                                    </button>
                                  </div>
                                  {isCopied && (
                                    <span className="text-xs text-emerald-700 font-bold block animate-in fade-in">
                                      ✓ কপি হয়েছে!
                                    </span>
                                  )}
                                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{new Date(order.createdAt).toLocaleDateString('bn-BD', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}</span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Customer Info & Quick Contact */}
                              <td className="p-4.5 align-top">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-100 text-emerald-950 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs border border-emerald-200/60">
                                      {initials.toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900 text-base leading-tight">
                                        {order.customerName}
                                      </div>
                                      <div className="text-sm text-slate-600 font-mono pt-0.5 font-medium">
                                        {order.customerPhone}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Contact Buttons */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <a
                                      href={`tel:${order.customerPhone}`}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer shadow-2xs"
                                      title="সরাসরি কল দিন"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>কল দিন</span>
                                    </a>
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                                      title="WhatsApp এ সরাসরি মেসেজ দিন"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
                                      <span>WhatsApp</span>
                                    </a>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Delivery Address & Area */}
                              <td className="p-4.5 align-top max-w-[220px]">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2 text-slate-800 text-sm leading-relaxed">
                                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <span className="font-medium" title={order.customerAddress}>
                                      {order.customerAddress}
                                    </span>
                                  </div>

                                  <div className="pt-0.5">
                                    <span
                                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                                        order.deliveryArea === 'inside_dhaka'
                                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                          : 'bg-purple-50 text-purple-900 border border-purple-200'
                                      }`}
                                    >
                                      {order.deliveryArea === 'inside_dhaka' ? '🏙️ ঢাকা সিটি (৭০৳)' : '🚚 ঢাকার বাইরে (১২০৳)'}
                                    </span>
                                  </div>

                                  {order.notes && (
                                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                                      💬 <b>নোট:</b> {order.notes}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 4. Ordered Items Breakdown */}
                              <td className="p-4.5 align-top max-w-[240px]">
                                <div className="space-y-2">
                                  {order.items.map((it, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2.5"
                                    >
                                      <div className="min-w-0">
                                        <div className="font-bold text-slate-900 text-sm truncate">
                                          {it.name}
                                        </div>
                                        {it.selectedSize && (
                                          <span className="inline-block text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-semibold mt-0.5">
                                            সাইজ: {it.selectedSize}
                                          </span>
                                        )}
                                      </div>
                                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-950 rounded-lg font-mono font-bold text-xs shrink-0">
                                        x{it.quantity}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* 5. Total Price & COD */}
                              <td className="p-4.5 align-top">
                                <div className="space-y-1.5">
                                  <div className="font-mono font-bold text-emerald-950 text-base sm:text-lg">
                                    ৳{order.totalAmount.toLocaleString('en-BD')}
                                  </div>
                                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                    ক্যাশ অন ডেলিভারি
                                  </span>
                                  {order.discount ? (
                                    <span className="text-xs text-emerald-700 font-bold block">
                                      ছাড়: -৳{order.discount}
                                    </span>
                                  ) : null}
                                </div>
                              </td>

                              {/* 6. Order Status Dropdown */}
                              <td className="p-4.5 align-top">
                                <div className="relative">
                                  <select
                                    value={order.status}
                                    onChange={(e) => {
                                      updateOrderStatus(order.id, e.target.value as OrderStatus);
                                      notifySuccess(`অর্ডার #${order.id}-এর স্ট্যাটাস পরিবর্তন হয়েছে!`);
                                    }}
                                    className={`w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs ${
                                      order.status === 'pending'
                                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                                        : order.status === 'confirmed'
                                        ? 'bg-blue-50 text-blue-900 border-blue-300'
                                        : order.status === 'shipped'
                                        ? 'bg-purple-50 text-purple-900 border-purple-300'
                                        : order.status === 'delivered'
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                        : 'bg-rose-50 text-rose-900 border-rose-300'
                                    }`}
                                  >
                                    <option value="pending">⏳ অপেক্ষমাণ (Pending)</option>
                                    <option value="confirmed">✓ নিশ্চিত (Confirmed)</option>
                                    <option value="shipped">🚚 শিপমেন্টে (Shipped)</option>
                                    <option value="delivered">🎉 ডেলিভার্ড (Delivered)</option>
                                    <option value="cancelled">✕ বাতিল (Cancelled)</option>
                                  </select>
                                  <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none opacity-60" />
                                </div>
                              </td>

                              {/* 7. Invoice & Actions */}
                              <td className="p-4.5 pr-6 align-top text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setIsInvoiceModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-sm font-bold transition cursor-pointer shadow-2xs"
                                    title="চালান ও পূর্ণাঙ্গ ইনভয়েস দেখুন"
                                  >
                                    <FileText className="w-4 h-4 text-emerald-700" />
                                    <span>চালান</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (window.confirm(`আপনি কি নিশ্চিত যে #${order.id} অর্ডারটি মুছে ফেলতে চান?`)) {
                                        deleteOrder(order.id);
                                        notifySuccess('অর্ডার সফলভাবে মুছে ফেলা হয়েছে!');
                                      }
                                    }}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                    title="অর্ডার ডিলিট করুন"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 2.5 COMBO CHART DATABASE MANAGER TAB */}
          {/* ==================================================== */}
          {activeTab === 'combo' && (
            <div className="space-y-6 max-w-6xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      কম্বো চার্ট প্যাকেজ কালেকশন (Combo Charts Manager)
                    </h2>
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {comboChartsList.length} টি সক্রিয়/তৈরিকৃত
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    ডাটাবেস থেকে সরাসরি কম্বো চার্টের নাম, টাইটেল, প্রাইস, সাইজ এবং অন্তর্ভুক্ত প্রোডাক্ট পরিবর্তন ও সাজান।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadComboCharts}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
                    title="ডাটাবেস রিফ্রেশ করুন"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিফ্রেশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddCombo}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ নতুন কম্বো তৈরি করুন</span>
                  </button>
                </div>
              </div>

              {/* Design & Mobile & Image Guidelines Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>💡 কম্বো চার্ট ছবি ও মোবাইল ডিসপ্লে গাইডলাইন (Image & Mobile Guide)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-extrabold text-amber-200 block text-[13px]">📸 পারফেক্ট ছবির সাইজ ও অনুপাত</span>
                    <p className="text-slate-200 leading-relaxed">
                      আউটার সেকশন পাই-চার্টের জন্য <b>১:১ স্কয়ার (Square)</b> সাইজের ছবি দিন। সেরা রেজোলিউশন হলো <b>800 × 800 px</b> (অথবা ন্যূনতম 600 × 600 px)।
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-extrabold text-amber-200 block text-[13px]">🎯 সেন্টারিং ও প্যাডিং টিপস</span>
                    <p className="text-slate-200 leading-relaxed">
                      পণ্যের ছবিটি ফ্রেমের ঠিক মাঝখানে রাখবেন এবং চারপাশে <b>২০%–২৫% খালি জায়গা</b> রাখুন, যাতে কার্ভড পাই স্লাইসে ছবি সুন্দর ফুটে ওঠে এবং কোনো অংশ না কাটে।
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-extrabold text-amber-200 block text-[13px]">📱 মোবাইল ভার্শন ও সাইজ XL</span>
                    <p className="text-slate-200 leading-relaxed">
                      ডিফল্ট চার্ট সাইজ <b>XL</b> সেট করা হয়েছে। মোবাইল ব্যবহারকারীদের জন্য আউটার কার্ড এবং লেবেল স্বয়ংক্রিয়ভাবে রেসপনসিভ হয়ে স্ক্রিনে ফিট হয়ে যাবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Combo Charts List */}
              {comboChartsList.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
                    🥧
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">কোনো কম্বো চার্ট পাওয়া যায়নি</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    আপনার শপে এখনো কোনো কম্বো চার্ট যোগ করা হয়নি। গ্রাহকদের স্পেশাল অফার দেখাতে এখনই নতুন কম্বো তৈরি করুন।
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddCombo}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer"
                  >
                    + প্রথম কম্বো চার্ট তৈরি করুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {comboChartsList.map((chart) => {
                    const productsInChart = chart.productIds
                      .map((pid) => data.products.find((p) => p.id === pid))
                      .filter(Boolean) as Product[];

                    const sumOriginal = productsInChart.reduce(
                      (acc, p) => acc + (p.originalPrice || p.price),
                      0
                    );
                    const saving = sumOriginal > chart.price ? sumOriginal - chart.price : 0;
                    const catObj = data.categories.find((c) => c.id === chart.categoryId);

                    return (
                      <div
                        key={chart.id}
                        className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xs flex flex-col justify-between ${
                          chart.isActive
                            ? 'border-slate-200 hover:border-emerald-500/60'
                            : 'border-slate-200/60 opacity-70 bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-4">
                          {/* Top Badges & Toggle */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleComboActive(chart)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                                  chart.isActive
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                                title="ক্লিক করে চালু/বন্ধ করুন"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    chart.isActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                                  }`}
                                />
                                <span>{chart.isActive ? '✓ সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}</span>
                              </button>

                              {chart.packageSize && (
                                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                  ✨ {chart.packageSize}
                                </span>
                              )}

                              {catObj && (
                                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {catObj.icon} {catObj.name}
                                </span>
                              )}

                              {chart.shape && (
                                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  {chart.shape === 'flower'
                                    ? '🪷 ফ্লাওয়ার'
                                    : chart.shape === 'hexagon'
                                    ? '⬡ হেক্সাগন'
                                    : chart.shape === 'octagon'
                                    ? '🛑 অক্টাগন'
                                    : chart.shape === 'squircle'
                                    ? '▢ স্কোয়ার্কল'
                                    : chart.shape === 'diamond'
                                    ? '💎 ডায়মন্ড'
                                    : '⭕ রাউন্ড'}
                                </span>
                              )}
                            </div>

                            {/* ID tag */}
                            <span className="font-mono text-[10px] text-slate-400">
                              #{chart.id.slice(0, 8)}
                            </span>
                          </div>

                          {/* Title & Price */}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                              {chart.title}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-800 block">
                                ৳{chart.price.toLocaleString('en-BD')}
                              </span>
                              {saving > 0 && (
                                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.2 rounded-md inline-block">
                                  সাশ্রয় ৳{saving.toLocaleString('en-BD')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Included Products List Preview */}
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              প্যাকেজের পণ্যসমূহ ({productsInChart.length}টি):
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {productsInChart.map((p, idx) => (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70"
                                >
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-8 h-8 rounded-lg object-cover shrink-0 bg-white border border-slate-200"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-slate-800 truncate">
                                      #{idx + 1} {p.name}
                                    </p>
                                    <span className="text-[10px] font-bold text-emerald-700">
                                      ৳{p.price}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 📢 Facebook Ads / Direct Boost Link Bar */}
                          <div className="mt-3.5 p-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/70 border border-blue-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-blue-950 font-black text-xs mb-1">
                                <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>ফেসবুক বুস্টিং স্বাধীন লিংক (Facebook Ads):</span>
                              </div>
                              <div className="font-mono text-[11px] text-blue-800 truncate bg-white/95 border border-blue-200/80 rounded-lg px-2.5 py-1 select-all shadow-2xs">
                                {typeof window !== 'undefined' ? `${window.location.origin}/?combo=${chart.id}` : `/?combo=${chart.id}`}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleCopyComboLink(chart.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                                  copiedComboId === chart.id
                                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                                }`}
                                title="ফেসবুক বুস্টিং বা ক্যাম্পেইনে ব্যবহারের জন্য লিংক কপি করুন"
                              >
                                {copiedComboId === chart.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>কপি হয়েছে!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>লিংক কপি</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={`/?combo=${chart.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition border border-blue-200 cursor-pointer flex items-center justify-center shadow-2xs"
                                title="সরাসরি নতুন ট্যাবে ল্যান্ডিং পেজ প্রিভিউ দেখুন"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                          {/* Quick Shape Selector on the Card */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-500">শেপ:</span>
                            <select
                              value={chart.shape || 'circle'}
                              onChange={async (e) => {
                                const newShape = e.target.value as ComboChartShape;
                                await updateComboChart(chart.id, { shape: newShape });
                                notifySuccess(`কম্বোর শেপ সফলভাবে পরিবর্তন করা হয়েছে!`);
                                loadComboCharts();
                              }}
                              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              title="এডমিন প্যানেল থেকে এই কম্বোর চার্ট শেপ নির্ধারণ করুন"
                            >
                              <option value="circle">⭕ রাউন্ড (Circle)</option>
                              <option value="hexagon">⬡ হেক্সাগন (Hexagon)</option>
                              <option value="flower">🪷 ফ্লাওয়ার (Flower)</option>
                              <option value="octagon">🛑 অক্টাগন (Octagon)</option>
                              <option value="squircle">▢ স্কোয়ার্কল (Squircle)</option>
                              <option value="diamond">💎 ডায়মন্ড (Diamond)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCombo(chart)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>এডিট করুন</span>
                            </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCombo(chart.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200 cursor-pointer"
                            title="কম্বো চার্ট মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. SECTION ORDER & CUSTOMIZATION TAB */}
          {/* ==================================================== */}
          {activeTab === 'sections' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    হোমপেজ সেকশন কাস্টমাইজেশন ও ক্রম নির্ধারণ
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    কোন সেকশনটি আগে (১ম) এবং কোনটি পরে (২য়, ৩য়...) আসবে তা মাউসের ক্লিকেই নিয়ন্ত্রণ করুন
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSections}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
                    title="ডিফল্ট ক্রম ফিরিয়ে আনুন"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট ক্রম</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSections}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>পরিবর্তন সেভ করুন</span>
                  </button>
                </div>
              </div>

              {/* Visual Flow Breadcrumb Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  বর্তমান হোমপেজ লেআউট ও সিকোয়েন্স (Live Structure Flow):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {localHomeSections.map((sec, idx) => (
                    <React.Fragment key={sec.id}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          sec.enabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{sec.name.split(' ')[0]}</span>
                      </span>
                      {idx < localHomeSections.length - 1 && (
                        <span className="text-slate-300 font-bold text-xs">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 1. Main Homepage Sections List */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    ১. মূল হোমপেজ সেকশনসমূহের ক্রম (Home Sections Order)
                  </h3>
                  <p className="text-xs text-slate-500">
                    উপরে (▲) বা নিচে (▼) বাটনে ক্লিক করে যেকোনো সেকশন আগে বা পরে নিয়ে যান
                  </p>
                </div>

                <div className="space-y-3">
                  {localHomeSections.map((sec, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === localHomeSections.length - 1;

                    return (
                      <div
                        key={sec.id}
                        className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                          sec.enabled
                            ? 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                            : 'bg-slate-100/50 border-dashed border-slate-300 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                            {idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{sec.name}</h4>
                              {sec.enabled ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  সক্রিয়
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300">
                                  লুকানো
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
                          </div>
                        </div>

                        {/* Order & Visibility Controls */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          {/* Move Up Button */}
                          <button
                            type="button"
                            onClick={() => moveSectionUp(idx)}
                            disabled={isFirst}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                            title="উপরে নিন (Move Up)"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                            <span>উপরে</span>
                          </button>

                          {/* Move Down Button */}
                          <button
                            type="button"
                            onClick={() => moveSectionDown(idx)}
                            disabled={isLast}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                            title="নিচে নিন (Move Down)"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-sky-700" />
                            <span>নিচে</span>
                          </button>

                          {/* Enable/Disable Toggle Button */}
                          <button
                            type="button"
                            onClick={() => toggleSectionEnabled(sec.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer shadow-2xs ${
                              sec.enabled
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                            }`}
                            title={sec.enabled ? 'হাইড বা লুকান' : 'প্রদর্শন করুন'}
                          >
                            {sec.enabled ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>চালু</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                <span>বন্ধ</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Category Product Showcase Ordering */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    ২. ক্যাটাগরি প্রোডাক্ট শোকেসের ক্রম (Category Showcase Sections)
                  </h3>
                  <p className="text-xs text-slate-500">
                    'ক্যাটাগরি অনুযায়ী প্রোডাক্ট শোকেস' সেকশনের ভেতরে কোন ক্যাটাগরিটি আগে (পাঞ্জাবি, আতর, জায়নামাজ ইত্যাদি) আসবে তা সাজান
                  </p>
                </div>

                <div className="space-y-3">
                  {localCategoryBanners.map((banner, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === localCategoryBanners.length - 1;
                    const isEnabled = banner.enabled !== false;

                    return (
                      <div
                        key={banner.id || banner.categoryId}
                        className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                          isEnabled
                            ? 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                            : 'bg-slate-100/50 border-dashed border-slate-300 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>

                          <div className="flex items-center gap-2.5">
                            {banner.image && (
                              <img
                                src={banner.image}
                                alt={banner.banglaTitle}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                  {banner.banglaTitle}
                                </h4>
                                <span className="text-[10px] font-mono text-slate-400 uppercase">
                                  ({banner.englishTitle || banner.categoryId})
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{banner.tagline}</p>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCategoryBannerUp(idx)}
                            disabled={isFirst}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer shadow-2xs"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                            <span>উপরে</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => moveCategoryBannerDown(idx)}
                            disabled={isLast}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer shadow-2xs"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-sky-700" />
                            <span>নিচে</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCategoryBannerEnabled(banner.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer shadow-2xs ${
                              isEnabled
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                            }`}
                          >
                            {isEnabled ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>সক্রিয়</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                <span>লুকানো</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSections}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>হোমপেজ সেকশন বিন্যাস সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. HEADER & MENU TAB */}
          {/* ==================================================== */}
          {activeTab === 'header' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">হেডার, লোগো ও মেনু সেটিংস</h2>
                <p className="text-xs sm:text-sm text-slate-500">ওয়েবসাইটের উপরের অংশের ব্র্যান্ডিং, নোটিস ও মেনু কন্ট্রোল করুন</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Brand Logo & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">সাইটের নাম (Brand Name)</label>
                    <input
                      type="text"
                      value={localSettings.siteName}
                      onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">ট্যাগলাইন (Tagline)</label>
                    <input
                      type="text"
                      value={localSettings.tagline}
                      onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>
                </div>

                {/* Custom Logo Image with Recommended Size */}
                <ImageUploadField
                  label="কাস্টম লোগো ছবি (ঐচ্ছিক - দিলে টেক্সট লোগোর বদলে এটি দেখাবে)"
                  recommendedSize="১৮০ × ৫০ পিক্সেল (PNG ট্রান্সপারেন্ট)"
                  value={localSettings.logoImageUrl || ''}
                  onChange={(url) => setLocalSettings({ ...localSettings, logoImageUrl: url })}
                />

                {/* Top Bar Announcement */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">টপ বার অ্যানাউন্সমেন্ট ও অফার নোটিস</h4>
                    <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.showAnnouncement}
                        onChange={(e) => setLocalSettings({ ...localSettings, showAnnouncement: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>টপ বার চালু রাখুন</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">আরবি শুভেচ্ছা / ক্যালিগ্রাফি</label>
                      <input
                        type="text"
                        value={localSettings.announcementArabic}
                        onChange={(e) => setLocalSettings({ ...localSettings, announcementArabic: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">অ্যানাউন্সমেন্ট টেক্সট</label>
                      <input
                        type="text"
                        value={localSettings.announcementText}
                        onChange={(e) => setLocalSettings({ ...localSettings, announcementText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Helpline Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">হেল্পলাইন নম্বর (ক্লিকযোগ্য লিঙ্ক)</label>
                    <input
                      type="text"
                      value={localSettings.helplinePhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, helplinePhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">হেল্পলাইন প্রদর্শিত লেখা</label>
                    <input
                      type="text"
                      value={localSettings.helplineDisplay}
                      onChange={(e) => setLocalSettings({ ...localSettings, helplineDisplay: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>
                </div>

                {/* Navigation Links Manager */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>হেডার নেভিগেশন মেনু (ক্রম ও ভিজিবিলিটি কন্ট্রোল)</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          মোট: {localNavLinks.length}টি
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        মেনুর বাটনগুলো আগে-পিছে সাজান, প্রয়োজনীয় মেনু লুকান বা প্রদর্শন করুন
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetNavLinks}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        title="ডিফল্ট মেনু রিস্টোর করুন"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>ডিফল্ট মেনু</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `nav-${Date.now()}`;
                          setLocalNavLinks([
                            ...localNavLinks,
                            { id: newId, name: 'নতুন মেনু', categoryId: 'all', enabled: true },
                          ]);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>নতুন মেনু যোগ</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {localNavLinks.map((link, idx) => {
                      const isEnabled = link.enabled !== false;
                      return (
                        <div
                          key={link.id || idx}
                          className={`p-3 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            isEnabled
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              : 'bg-slate-100/70 border-dashed border-slate-300 opacity-70'
                          }`}
                        >
                          {/* Order Index & Name Input */}
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                              #{idx + 1}
                            </span>
                            
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={link.name}
                                onChange={(e) => {
                                  const copy = [...localNavLinks];
                                  copy[idx] = { ...copy[idx], name: e.target.value };
                                  setLocalNavLinks(copy);
                                }}
                                placeholder="মেনুর নাম লিখুন..."
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600 transition"
                              />
                            </div>
                          </div>

                          {/* Category Link Selector & Options */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                              <span className="text-slate-400 font-semibold text-[11px]">ক্যাটাগরি:</span>
                              <select
                                value={link.categoryId || link.id || 'all'}
                                onChange={(e) => {
                                  const copy = [...localNavLinks];
                                  copy[idx] = { ...copy[idx], categoryId: e.target.value };
                                  setLocalNavLinks(copy);
                                }}
                                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                              >
                                {CATEGORIES.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.id})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Sparkle Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleNavLinkSparkle(idx)}
                              className={`p-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                link.showSparkle
                                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                              }`}
                              title={link.showSparkle ? 'ঝিলমিল ব্যাজ সক্রিয় (বন্ধ করতে ক্লিক করুন)' : 'ঝিলমিল ব্যাজ বন্ধ (চালু করতে ক্লিক করুন)'}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">ঝিলমিল</span>
                            </button>

                            {/* Visibility Toggle Button (লুকানো / দেখানো) */}
                            <button
                              type="button"
                              onClick={() => toggleNavLinkEnabled(idx)}
                              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                isEnabled
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                  : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                              }`}
                              title={isEnabled ? 'ক্লিক করে এই মেনু লুকান' : 'ক্লিক করে এই মেনু দৃশ্যমান করুন'}
                            >
                              {isEnabled ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>দৃশ্যমান</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                                  <span>লুকানো</span>
                                </>
                              )}
                            </button>

                            {/* Reorder Buttons (আগে ও পিছে) */}
                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                              <button
                                type="button"
                                onClick={() => moveNavLinkUp(idx)}
                                disabled={idx === 0}
                                className={`p-1 rounded-lg transition ${
                                  idx === 0
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-700 hover:bg-slate-100 cursor-pointer active:scale-95'
                                }`}
                                title="আগে নিন (Move Up / Left)"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveNavLinkDown(idx)}
                                disabled={idx === localNavLinks.length - 1}
                                className={`p-1 rounded-lg transition ${
                                  idx === localNavLinks.length - 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-700 hover:bg-slate-100 cursor-pointer active:scale-95'
                                }`}
                                title="পিছে নিন (Move Down / Right)"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`'${link.name}' মেনুটি মুছে ফেলতে চান?`)) {
                                  setLocalNavLinks(localNavLinks.filter((_, i) => i !== idx));
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition cursor-pointer"
                              title="মেনু মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveSettings();
                      handleSaveNavLinks();
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>হেডার পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. HERO & BANNERS TAB */}
          {/* ==================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">হিরো স্লাইডার ও ব্যানার ম্যানেজার</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  হোমপেজের মূল হিরো ব্যানার, ছবি ও ফিচারড ৩টি কার্ডের লেখা এবং ছবি নিয়ন্ত্রণ করুন
                </p>
              </div>

              {/* Main Hero Banner */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  ১. মূল হিরো ব্যানার (Hero Spotlight)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">টপ ব্যাজ টেক্সট</label>
                    <input
                      type="text"
                      value={localHero.badgeText}
                      onChange={(e) => setLocalHero({ ...localHero, badgeText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">বাটন টেক্সট</label>
                    <input
                      type="text"
                      value={localHero.ctaButtonText}
                      onChange={(e) => setLocalHero({ ...localHero, ctaButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">টাইটেল শুরুর অংশ</label>
                    <input
                      type="text"
                      value={localHero.titlePrefix}
                      onChange={(e) => setLocalHero({ ...localHero, titlePrefix: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">টাইটেল হাইলাইট অংশ (সোনালী রং)</label>
                    <input
                      type="text"
                      value={localHero.titleHighlight}
                      onChange={(e) => setLocalHero({ ...localHero, titleHighlight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-amber-700 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">সাব-টাইটেল / সংক্ষিপ্ত বিবরণ</label>
                  <textarea
                    rows={2}
                    value={localHero.description}
                    onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                {/* Hero Spotlight Image */}
                <ImageUploadField
                  label="হিরো ব্যানার প্রধান ছবি"
                  recommendedSize="৮০০ × ৮০০ পিক্সেল (১:১ স্কয়ার) অথবা ১২০০ × ৬০০ পিক্সেল"
                  value={localHero.mainImage}
                  onChange={(url) => setLocalHero({ ...localHero, mainImage: url })}
                />

                {/* External Website Button under Image */}
                <div className="p-4 sm:p-5 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <label className="text-xs sm:text-sm font-bold text-slate-800">
                        ইমেজের নিচের বাটন (অন্য ওয়েবসাইট লিংক)
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localHero.showExternalButton !== false}
                        onChange={(e) =>
                          setLocalHero({ ...localHero, showExternalButton: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>চালু রাখুন</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">বাটনের লিখা (Button Text)</label>
                      <input
                        type="text"
                        placeholder="যেমন: আমাদের প্রধান ওয়েবসাইট ভিজিট করুন"
                        value={localHero.externalButtonText || ''}
                        onChange={(e) =>
                          setLocalHero({ ...localHero, externalButtonText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">অন্য ওয়েবসাইটের লিঙ্ক / URL</label>
                      <input
                        type="url"
                        placeholder="যেমন: https://your-other-site.com"
                        value={localHero.externalButtonUrl || ''}
                        onChange={(e) =>
                          setLocalHero({ ...localHero, externalButtonUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Showroom & Gift Collection Strip */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    ২. শোরুম ও স্পেশাল গিফট স্ট্রিপ ব্যানার
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localShowroomStrip.enabled}
                      onChange={(e) =>
                        setLocalShowroomStrip({ ...localShowroomStrip, enabled: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>চালু রাখুন</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">ব্যানার শিরোনাম (Title)</label>
                    <input
                      type="text"
                      value={localShowroomStrip.title}
                      onChange={(e) =>
                        setLocalShowroomStrip({ ...localShowroomStrip, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">ব্যাজ টেক্সট (Badge)</label>
                    <input
                      type="text"
                      value={localShowroomStrip.badge}
                      onChange={(e) =>
                        setLocalShowroomStrip({ ...localShowroomStrip, badge: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">সাব-টাইটেল / বিবরণ</label>
                    <input
                      type="text"
                      value={localShowroomStrip.subtitle}
                      onChange={(e) =>
                        setLocalShowroomStrip({ ...localShowroomStrip, subtitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">বাটন টেক্সট</label>
                    <input
                      type="text"
                      value={localShowroomStrip.buttonText}
                      onChange={(e) =>
                        setLocalShowroomStrip({ ...localShowroomStrip, buttonText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Category Showcase Banners Manager (New Design) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ৩. ক্যাটাগরি শোকেস ব্যানারসমূহ (নতুন শোরুম ডিজাইন)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    প্রতিটি ক্যাটাগরির (পাঞ্জাবি, আতর, জায়নামাজ, তসবিহ, আজওয়া ও মধু, কম্বো) বড় থিম ব্যানার, ছবি ও লেখা পরিবর্তন করুন
                  </p>
                </div>

                <div className="space-y-6">
                  {localCategoryBanners.map((banner, idx) => (
                    <div
                      key={banner.id || idx}
                      className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            {banner.englishTitle || banner.categoryId.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {banner.banglaTitle}
                          </span>
                        </div>

                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={banner.enabled !== false}
                            onChange={(e) => {
                              const copy = [...localCategoryBanners];
                              copy[idx].enabled = e.target.checked;
                              setLocalCategoryBanners(copy);
                            }}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>হোমপেজে দেখান</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700">বড় ইংরেজি টাইটেল (English Title)</label>
                          <input
                            type="text"
                            value={banner.englishTitle}
                            onChange={(e) => {
                              const copy = [...localCategoryBanners];
                              copy[idx].englishTitle = e.target.value;
                              setLocalCategoryBanners(copy);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold uppercase"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700">বাংলা টাইটেল (Bangla Title)</label>
                          <input
                            type="text"
                            value={banner.banglaTitle}
                            onChange={(e) => {
                              const copy = [...localCategoryBanners];
                              copy[idx].banglaTitle = e.target.value;
                              setLocalCategoryBanners(copy);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700">ট্যাগলাইন / সাবটাইটেল</label>
                          <input
                            type="text"
                            value={banner.tagline}
                            onChange={(e) => {
                              const copy = [...localCategoryBanners];
                              copy[idx].tagline = e.target.value;
                              setLocalCategoryBanners(copy);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">ব্যাজ টেক্সট</label>
                            <input
                              type="text"
                              value={banner.badge}
                              onChange={(e) => {
                                const copy = [...localCategoryBanners];
                                copy[idx].badge = e.target.value;
                                setLocalCategoryBanners(copy);
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-bold"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">বাটন টেক্সট</label>
                            <input
                              type="text"
                              value={banner.buttonText}
                              onChange={(e) => {
                                const copy = [...localCategoryBanners];
                                copy[idx].buttonText = e.target.value;
                                setLocalCategoryBanners(copy);
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Banner Image Upload */}
                      <ImageUploadField
                        label={`${banner.banglaTitle} ব্যানার ছবি`}
                        recommendedSize="৮০০ × ৪৫০ পিক্সেল (১৬:৯ ওয়াইড ব্যানার)"
                        value={banner.image}
                        onChange={(url) => {
                          const copy = [...localCategoryBanners];
                          copy[idx].image = url;
                          setLocalCategoryBanners(copy);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveHero}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>হিরো, শোরুম ও ক্যাটাগরি ব্যানারসমূহ সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 5. PRODUCTS & CATEGORIES TAB */}
          {/* ==================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">প্রোডাক্টস ও ক্যাটাগরি ম্যানেজার</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    সমস্ত পণ্যের মূল্য, স্টক, ছবি ও বিবরণ পরিবর্তন করুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রোডাক্ট যোগ করুন</span>
                </button>
              </div>

              {/* Categories Management Pills */}
              <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-xs">
                <span className="text-xs font-bold text-slate-700">বর্তমান ক্যাটাগরিসমূহ:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {data.categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <div
                        key={cat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                      >
                        <span>{cat.icon}</span>
                        <span className="font-bold">{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`'${cat.name}' ক্যাটাগরি মুছে ফেলতে চান?`)) {
                              deleteCategory(cat.id);
                              notifySuccess('ক্যাটাগরি মুছে ফেলা হয়েছে!');
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 text-sm ml-1 cursor-pointer font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>

                {/* Add Category Mini Form */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="ইমোজি (📿)"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-medium focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ক্যাটাগরি নাম (যেমন: আতর)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 min-w-[160px] px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatName.trim()) {
                        const id = `cat-${Date.now()}`;
                        addCategory({ id, name: newCatName.trim(), icon: newCatIcon });
                        setNewCatName('');
                        notifySuccess('নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে!');
                      }
                    }}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                  >
                    + ক্যাটাগরি যোগ
                  </button>
                </div>
              </div>

              {/* Products Table (Clean Light Modern) */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">ছবি</th>
                        <th className="p-4">প্রোডাক্টের নাম</th>
                        <th className="p-4">ক্যাটাগরি</th>
                        <th className="p-4">মূল্য</th>
                        <th className="p-4">স্টক</th>
                        <th className="p-4">ব্যাজ</th>
                        <th className="p-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block text-xs sm:text-sm">{p.name}</span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{p.description}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-emerald-800 text-xs sm:text-sm">৳{p.price}</div>
                            {p.originalPrice && (
                              <div className="text-[10.5px] text-slate-400 line-through">৳{p.originalPrice}</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            {p.inStock ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10.5px] border border-emerald-200">
                                স্টকে আছে
                              </span>
                            ) : (
                              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md text-[10.5px] border border-rose-200">
                                স্টক শেষ
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {p.badge && (
                              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md text-[10.5px] border border-amber-200 font-bold">
                                {p.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`'${p.name}' প্রোডাক্টটি নিশ্চিতভাবে মুছে ফেলতে চান?`)) {
                                    deleteProduct(p.id);
                                    notifySuccess('প্রোডাক্ট মুছে ফেলা হয়েছে!');
                                  }
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 6. TRUST & POLICIES TAB */}
          {/* ==================================================== */}
          {activeTab === 'trust' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">ট্রাস্ট ও পলিসি সেটিংস</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  শিপিং, রিটার্ন, রিফান্ড ও কোয়ালিটি নিশ্চয়তার পলিসি টেক্সট পরিচালনা করুন
                </p>
              </div>

              {/* Shipping Policy */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  ১. শিপিং ও ডেলিভারি পলিসি
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={localPolicies.shipping.title}
                    onChange={(e) =>
                      setLocalPolicies({
                        ...localPolicies,
                        shipping: { ...localPolicies.shipping, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={localPolicies.shipping.subtitle}
                    onChange={(e) =>
                      setLocalPolicies({
                        ...localPolicies,
                        shipping: { ...localPolicies.shipping, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-3">
                  {localPolicies.shipping.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...localPolicies.shipping.items];
                          copy[idx].title = e.target.value;
                          setLocalPolicies({
                            ...localPolicies,
                            shipping: { ...localPolicies.shipping, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...localPolicies.shipping.items];
                          copy[idx].description = e.target.value;
                          setLocalPolicies({
                            ...localPolicies,
                            shipping: { ...localPolicies.shipping, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Policy */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  ২. সহজ রিটার্ন পলিসি
                </h3>
                <div className="space-y-3">
                  {localPolicies.return.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...localPolicies.return.items];
                          copy[idx].title = e.target.value;
                          setLocalPolicies({
                            ...localPolicies,
                            return: { ...localPolicies.return, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...localPolicies.return.items];
                          copy[idx].description = e.target.value;
                          setLocalPolicies({
                            ...localPolicies,
                            return: { ...localPolicies.return, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePolicies}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>পলিসি পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 7. REVIEWS & TESTIMONIALS TAB */}
          {/* ==================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">গ্রাহক রিভিউ ও টেস্টিমোনিয়াল</h2>
                  <p className="text-xs sm:text-sm text-slate-500">কাস্টমারদের আসল রিভিউ ও রেটিং যোগ বা পরিবর্তন করুন</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newId = `t-${Date.now()}`;
                    addTestimonial({
                      id: newId,
                      name: 'নতুন গ্রাহকের নাম',
                      location: 'ঢাকা',
                      comment: 'পণ্যটি অনেক ভালো লেগেছে। জাজাকাল্লাহু খাইরান।',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                      product: 'রয়েল এরাবিয়ান ওউদ আতর',
                    });
                    notifySuccess('নতুন রিভিউ যুক্ত হয়েছে!');
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
                >
                  + নতুন রিভিউ যোগ করুন
                </button>
              </div>

              <div className="space-y-4">
                {data.testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">রিভিউ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`'${t.name}' এর রিভিউ মুছে ফেলতে চান?`)) {
                            deleteTestimonial(t.id);
                            notifySuccess('রিভিউ মুছে ফেলা হয়েছে!');
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer flex items-center gap-1 font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600 font-bold">গ্রাহকের নাম</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTestimonial({ ...t, name: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600 font-bold">লোকেশন / জেলা</label>
                        <input
                          type="text"
                          value={t.location}
                          onChange={(e) => updateTestimonial({ ...t, location: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600 font-bold">পণ্য নাম</label>
                        <input
                          type="text"
                          value={t.product}
                          onChange={(e) => updateTestimonial({ ...t, product: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 font-bold">গ্রাহকের মন্তব্য</label>
                      <textarea
                        rows={2}
                        value={t.comment}
                        onChange={(e) => updateTestimonial({ ...t, comment: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs"
                      />
                    </div>

                    <ImageUploadField
                      label="গ্রাহকের ছবি / প্রোফাইল অবতার"
                      recommendedSize="১০০ × ১০০ পিক্সেল (১:১ স্কয়ার)"
                      value={t.avatar}
                      onChange={(url) => updateTestimonial({ ...t, avatar: url })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 8. FOOTER & GLOBAL SETTINGS TAB */}
          {/* ==================================================== */}
          {activeTab === 'footer' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">ফুটার ও কন্টাক্ট ইনফো সেটিংস</h2>
                <p className="text-xs sm:text-sm text-slate-500">ফুটারের বিবরণ, সোশ্যাল লিঙ্ক ও হোয়াটসঅ্যাপ সহায়তা নম্বর</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">কোম্পানির বিবরণ (About Us Summary)</label>
                  <textarea
                    rows={2}
                    value={localSettings.copyrightText}
                    onChange={(e) => setLocalSettings({ ...localSettings, copyrightText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">অফিস / শপ ঠিকানা</label>
                    <input
                      type="text"
                      value={localSettings.address}
                      onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">কাজের সময় (Working Hours)</label>
                    <input
                      type="text"
                      value={localSettings.workingHours}
                      onChange={(e) => setLocalSettings({ ...localSettings, workingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">সাপোর্ট ইমেইল</label>
                    <input
                      type="email"
                      value={localSettings.supportEmail}
                      onChange={(e) => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">ফ্লোটিং WhatsApp নম্বর (কান্ট্রি কোড সহ)</label>
                    <input
                      type="text"
                      value={localSettings.whatsappNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                      placeholder="8801700000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">সোশ্যাল মিডিয়া পেজ লিংক</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 font-bold">Facebook Page URL</label>
                      <input
                        type="text"
                        value={localSettings.socialLinks.facebook}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            socialLinks: { ...localSettings.socialLinks, facebook: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 font-bold">Instagram URL</label>
                      <input
                        type="text"
                        value={localSettings.socialLinks.instagram}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            socialLinks: { ...localSettings.socialLinks, instagram: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>ফুটার ও কন্টাক্ট ইনফো সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 9. SUPABASE & DATABASE TAB */}
          {/* ==================================================== */}
          {activeTab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Supabase ডাটাবেস ও ক্লাউড ব্যাকআপ</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  সরাসরি Supabase PostgreSQL ক্লাউড ডাটাবেসের সাথে যুক্ত করুন ও ব্যাকআপ রাখুন
                </p>
              </div>

              {/* Supabase Connection Form */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      ১. Supabase Credentials (স্থায়ী ক্লাউড কনফিগারেশন)
                    </h3>
                    <p className="text-xs text-slate-500">
                      এই ক্রেডেনশিয়াল সকল ডিভাইস, মোবাইল এবং নেটওয়ার্কে স্থায়ীভাবে সংযুক্ত থাকে
                    </p>
                  </div>
                  {PERMANENT_SUPABASE_CONFIG.url ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      স্থায়ী কনফিগারেশন সক্রিয়
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 w-fit">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      লোকাল মোড
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Supabase Project URL</label>
                    {PERMANENT_SUPABASE_CONFIG.url && (
                      <span className="text-[11px] font-semibold text-emerald-600">স্থায়ী লিংক ডিফল্ট সংরক্ষিত</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-mono font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Supabase Anon Public Key</label>
                    {PERMANENT_SUPABASE_CONFIG.anonKey && (
                      <span className="text-[11px] font-semibold text-emerald-600">স্থায়ী অ্যানন কি ডিফল্ট সংরক্ষিত</span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={dbKey}
                    onChange={(e) => setDbKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {dbTestResult && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold ${
                      dbTestResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {dbTestResult.message}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestDb}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    কানেকশন টেস্ট করুন
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDbConfig}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    সেটিংস সেভ করুন
                  </button>

                  {PERMANENT_SUPABASE_CONFIG.url && (
                    <button
                      type="button"
                      onClick={() => {
                        setDbUrl(PERMANENT_SUPABASE_CONFIG.url);
                        setDbKey(PERMANENT_SUPABASE_CONFIG.anonKey);
                        updateSupabaseConfig({
                          url: PERMANENT_SUPABASE_CONFIG.url,
                          anonKey: PERMANENT_SUPABASE_CONFIG.anonKey,
                          isConnected: true,
                        });
                        notifySuccess('স্থায়ী ডিফল্ট Supabase ক্রেডেনশিয়াল রিস্টোর করা হয়েছে!');
                      }}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 cursor-pointer"
                      title="স্থায়ী ডিফল্ট মান ফিরিয়ে আনুন"
                    >
                      ডিফল্ট রিস্টোর
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSyncToSupabase}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSaving ? 'সিঙ্ক হচ্ছে...' : 'এখনই ডাটাবেসে সেভ ও সিঙ্ক করুন'}
                  </button>

                  <button
                    type="button"
                    onClick={handleFetchFromSupabase}
                    disabled={isLoading}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {isLoading ? 'লোড হচ্ছে...' : 'Supabase থেকে ডাটা রিফ্রেশ করুন'}
                  </button>
                </div>
              </div>

              {/* SQL Migration Script */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">২. Supabase SQL Migration Script</h3>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? '✓ কপি হয়েছে!' : 'SQL কোড কপি করুন'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  আপনার Supabase ড্যাশবোর্ডের <b>SQL Editor</b>-এ গিয়ে এই কোডটি পেস্ট করে `Run` করুন:
                </p>
                <pre className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>

              {/* JSON Export / Import Backup */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  ৩. লোকাল ব্যাকআপ এক্সপোর্ট ও ইমপোর্ট
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার পুরো ওয়েবসাইটের সমস্ত ডেটা, কাস্টমার অর্ডার ও কনফিগারেশন JSON ফাইল হিসেবে ডাউনলোড বা আপলোড করুন
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={exportBackupJson}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>এক্সপোর্ট ব্যাকআপ (JSON ডাউনলোড)</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>ইমপোর্ট ব্যাকআপ (JSON আপলোড)</span>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200 cursor-pointer sm:ml-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট রিস্টোর (Factory Reset)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <ProductEditModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          categories={data.categories}
          allProducts={data.products}
          onSave={async (savedProduct, comboPayload) => {
            if (selectedProduct) {
              updateProduct(savedProduct);
              notifySuccess('প্রোডাক্ট সফলভাবে আপডেট হয়েছে!');
            } else {
              addProduct(savedProduct);
              notifySuccess('নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!');
            }
            if (comboPayload) {
              await createComboChart(comboPayload);
              notifySuccess('ক্যাটাগরি কম্বো চার্ট সফলভাবে তৈরি হয়েছে!');
            }
          }}
        />
      )}

      {/* Order Invoice & Details Modal */}
      {isInvoiceModalOpen && selectedOrder && (
        <OrderInvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          siteSettings={data.siteSettings}
          onStatusChange={(orderId, status) => {
            updateOrderStatus(orderId, status);
            setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
            notifySuccess(`অর্ডার ${orderId}-এর স্ট্যাটাস পরিবর্তন করা হয়েছে!`);
          }}
        />
      )}

      {/* Combo Chart Add/Edit Modal */}
      {isComboFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingComboId ? 'কম্বো চার্ট তথ্য পরিবর্তন করুন' : 'নতুন কম্বো চার্ট তৈরি করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    টাইটেল, মূল্য, সাইজ এবং অন্তর্ভুক্ত পণ্য ডাটাবেসে সেভ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsComboFormModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Facebook Ads Boost Link Box in Modal */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/70 border border-blue-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-blue-950 font-black text-xs mb-1">
                    <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>ফেসবুক বুস্টিং স্বাধীন লিংক (Facebook Ads Direct Link):</span>
                  </div>
                  <div className="font-mono text-[11px] text-blue-800 truncate bg-white/95 border border-blue-200/80 rounded-lg px-2.5 py-1">
                    {editingComboId 
                      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?combo=${editingComboId}`
                      : '⚡ কম্বো চার্ট সেভ করার সাথে সাথেই প্রতিটি কম্বোর জন্য এই লিংক প্রস্তুত হয়ে যাবে'}
                  </div>
                </div>
                {editingComboId && (
                  <button
                    type="button"
                    onClick={() => handleCopyComboLink(editingComboId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                      copiedComboId === editingComboId
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    }`}
                  >
                    {copiedComboId === editingComboId ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>লিংক কপি</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Field 1: Title */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  কম্বো চার্ট টাইটেল / নাম *
                </label>
                <input
                  type="text"
                  value={comboFormData.title}
                  onChange={(e) => setComboFormData({ ...comboFormData, title: e.target.value })}
                  placeholder="যেমন: সৌদি গোল্ডেন সুক্কারি খেজুর স্পেশাল কম্বো"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              {/* Field 2 & 3: Price & Package Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    কম্বো বিক্রয় মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    value={comboFormData.price || ''}
                    onChange={(e) => setComboFormData({ ...comboFormData, price: Number(e.target.value) })}
                    placeholder="যেমন: 1513"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    প্যাকেজ সাইজ / বর্ণনা
                  </label>
                  <input
                    type="text"
                    value={comboFormData.packageSize}
                    onChange={(e) => setComboFormData({ ...comboFormData, packageSize: e.target.value })}
                    placeholder="যেমন: ৩ পিস স্পেশাল কম্বো বা ১ কেজি + ৫০০ গ্রাম"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Field 4 & 5: Category & Active status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    ক্যাটাগরি লিংক (ঐচ্ছিক)
                  </label>
                  <select
                    value={comboFormData.categoryId}
                    onChange={(e) => setComboFormData({ ...comboFormData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white"
                  >
                    <option value="all">সকল ক্যাটাগরি (সাধারণ শোকেস)</option>
                    {data.categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 sm:pt-6">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={comboFormData.isActive}
                      onChange={(e) => setComboFormData({ ...comboFormData, isActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      হোমপেজে সক্রিয়ভাবে প্রদর্শন করুন
                    </span>
                  </label>
                </div>
              </div>

              {/* Field: Chart Outer Shape Selector */}
              <div className="pt-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  চার্ট আউটার শেপ (Chart Outer Shape)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'circle', name: 'রাউন্ড (Circle)', icon: '⭕', desc: 'বৃত্তাকার ক্লাসিক' },
                    { id: 'hexagon', name: 'হেক্সাগন (Hexagon)', icon: '⬡', desc: '৬-কোণ বিশিষ্ট জ্যামিতিক' },
                    { id: 'flower', name: 'ফ্লাওয়ার (Flower)', icon: '🪷', desc: 'বাঁকানো পাপড়ি অর্গানিক' },
                    { id: 'octagon', name: 'অক্টাগন (Octagon)', icon: '🛑', desc: '৮-কোণ ইসলামিক নকশা' },
                    { id: 'squircle', name: 'স্কোয়ার্কল (Squircle)', icon: '▢', desc: 'মডার্ন সফট স্কয়ার' },
                    { id: 'diamond', name: 'ডায়মন্ড (Diamond)', icon: '💎', desc: 'হীরক আকৃতি' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setComboFormData({ ...comboFormData, shape: s.id as ComboChartShape })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        comboFormData.shape === s.id
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{s.icon}</span>
                        <span className="text-xs font-bold">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 6: Products Selector */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      কম্বোতে অন্তর্ভুক্ত পণ্য নির্বাচন করুন ({comboFormData.productIds.length}টি নির্বাচিত)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      কম্বো পাই-চার্টে এই পণ্যগুলোর ছবি ও নাম প্রদর্শিত হবে
                    </p>
                  </div>

                  {/* Search inside modal */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={comboProductSearch}
                      onChange={(e) => setComboProductSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Category filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setComboProductCategoryFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                      comboProductCategoryFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    সকল পণ্য
                  </button>
                  {data.categories.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setComboProductCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1 ${
                        comboProductCategoryFilter === cat.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Product checkboxes grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                  {data.products
                    .filter((p) => {
                      if (comboProductCategoryFilter !== 'all' && p.category !== comboProductCategoryFilter) {
                        return false;
                      }
                      if (comboProductSearch.trim()) {
                        return p.name.toLowerCase().includes(comboProductSearch.toLowerCase());
                      }
                      return true;
                    })
                    .map((product) => {
                      const isSelected = comboFormData.productIds.includes(product.id);
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            if (isSelected) {
                              setComboFormData({
                                ...comboFormData,
                                productIds: comboFormData.productIds.filter((id) => id !== product.id),
                              });
                            } else {
                              setComboFormData({
                                ...comboFormData,
                                productIds: [...comboFormData.productIds, product.id],
                              });
                            }
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 shadow-2xs ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                          />
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {product.name}
                            </p>
                            <span className="text-[11px] font-mono font-black text-emerald-700">
                              ৳{product.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Live calculation bar */}
                {comboFormData.productIds.length > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-950">
                    <span>
                      নির্বাচিত {comboFormData.productIds.length}টি পণ্যের পৃথক মূল্য: ৳
                      {comboFormData.productIds
                        .map((pid) => data.products.find((p) => p.id === pid)?.price || 0)
                        .reduce((a, b) => a + b, 0)}
                    </span>
                    <span>
                      কম্বো মূল্য: ৳{comboFormData.price || 0}
                    </span>
                    <span className="text-rose-700">
                      কাস্টমার সেভ করবে: ৳
                      {Math.max(
                        0,
                        comboFormData.productIds
                          .map((pid) => data.products.find((p) => p.id === pid)?.price || 0)
                          .reduce((a, b) => a + b, 0) - (comboFormData.price || 0)
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsComboFormModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveCombo}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                {editingComboId ? 'পরিবর্তন সংরক্ষণ করুন' : 'কম্বো চার্ট তৈরি করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
