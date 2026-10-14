import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Layers,
  ArrowRight,
  Banknote,
  RotateCcw,
  Flame,
  Clock
} from 'lucide-react';
import { ProductComboChart } from './ProductComboChart';
import { ProductSection } from './ProductSection';
import { 
  fetchComboChartById, 
  fetchActiveComboCharts, 
  resolveComboProducts,
  createComboProductItem 
} from '../lib/comboChartService';
import { useCms } from '../context/CmsContext';
import { PRODUCTS } from '../data/products';
import type { ComboChart, Product } from '../types';

interface ComboLandingViewProps {
  comboId: string;
  onBackToHome: () => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenCheckout?: () => void;
}

export const ComboLandingView: React.FC<ComboLandingViewProps> = ({
  comboId,
  onBackToHome,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { data: cmsData } = useCms();
  const [comboChart, setComboChart] = useState<ComboChart | null>(null);
  const [allComboCharts, setAllComboCharts] = useState<ComboChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isOrderFeedback, setIsOrderFeedback] = useState(false);

  const allProducts = useMemo(() => {
    if (cmsData?.products && cmsData.products.length > 0) return cmsData.products;
    return PRODUCTS;
  }, [cmsData]);

  // Load target combo chart
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchComboChartById(comboId),
      fetchActiveComboCharts(),
    ]).then(([chart, activeList]) => {
      if (isMounted) {
        setAllComboCharts(activeList);
        if (chart) {
          setComboChart(chart);
          document.title = `${chart.title} - স্পেশাল কম্বো অফার | IQR Shop`;
        } else {
          // If not found by direct ID, search active list
          const found = activeList.find((c) => c.id === comboId);
          if (found) {
            setComboChart(found);
            document.title = `${found.title} - স্পেশাল কম্বো অফার | IQR Shop`;
          }
        }
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('Error loading combo for landing page:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [comboId]);

  // Resolve products for this combo
  const resolvedProducts = useMemo(() => {
    if (!comboChart) return [];
    return resolveComboProducts(comboChart.productIds, allProducts);
  }, [comboChart, allProducts]);

  // Calculate original total & savings
  const originalTotal = useMemo(() => {
    return resolvedProducts.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
  }, [resolvedProducts]);

  const savingsAmount = comboChart && originalTotal > comboChart.price
    ? originalTotal - comboChart.price
    : 0;

  // Live countdown to midnight & realistic remaining promo stock
  const [countdownStr, setCountdownStr] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const toBn = (n: number) => n.toString().padStart(2, '0').replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

      setCountdownStr(`${toBn(h)}:${toBn(m)}:${toBn(s)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const stockCountBn = useMemo(() => {
    if (!comboChart) return '৯';
    const daySeed = new Date().getDate();
    const charCodeSum = (comboChart.id || comboChart.title).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const count = 7 + ((charCodeSum + daySeed) % 6);
    return count.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
  }, [comboChart]);

  // Handle Copy Facebook Boost / Direct URL
  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?combo=${comboId}`
      : `?combo=${comboId}`;
    
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    }
  };

  // Handle Add All to Cart & Instant Checkout with exact combo discounted price
  const handleOrderEntireCombo = () => {
    if (!comboChart || resolvedProducts.length === 0) return;

    const comboProduct = createComboProductItem(comboChart, resolvedProducts);
    onBuyNow(comboProduct);

    setIsOrderFeedback(true);
    setTimeout(() => setIsOrderFeedback(false), 1500);
  };

  // Other recommended products (excluding those already in combo)
  const otherProducts = useMemo(() => {
    const inComboIds = new Set(comboChart?.productIds || []);
    return allProducts.filter((p) => !inComboIds.has(p.id)).slice(0, 4);
  }, [allProducts, comboChart]);

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-64 h-64 rounded-full border-8 border-stone-100 border-t-emerald-700 animate-spin" />
        <p className="mt-6 text-sm font-bold text-stone-600 animate-pulse">
          কম্বো অফার লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
        </p>
      </main>
    );
  }

  if (!comboChart) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-4xl">
          ⚠️
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900">
          কম্বো অফারটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-stone-500">
          এই কম্বো প্যাকেজটির মেয়াদ শেষ হয়ে থাকতে পারে অথবা আইডিটি সঠিক নয়।
        </p>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full font-bold text-sm hover:bg-emerald-900 transition cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল প্রোডাক্ট ও হোমপেজে ফিরে যান</span>
        </button>
      </main>
    );
  }

  const shapeLabel = {
    circle: '⭕ ক্লাসিক রাউন্ড',
    hexagon: '⬡ হেক্সাগন',
    flower: '🪷 ফ্লাওয়ার পাপড়ি',
    octagon: '🛑 রয়্যাল অক্টাগন',
    squircle: '▢ স্কোয়ার্কল',
    diamond: '💎 ডায়মন্ড',
  }[comboChart.shape || 'circle'];

  return (
    <main className="min-h-screen bg-stone-50/50 pb-16">
      
      {/* 1. Sticky Navigation & Share Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-emerald-900 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            <span>হোমপেজে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ফেসবুক ডিরেক্ট বুস্ট লিংক
            </span>

            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isCopied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
              }`}
              title="এই কম্বোর ফেসবুক বুস্টিং লিংক কপি করুন"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{isCopied ? 'লিংক কপি হয়েছে!' : 'লিংক শেয়ার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Headline Banner for Direct Traffic */}
      <div className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-black uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>স্পেশাল কম্বো অফার • সীমিত সময়ের জন্য</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight max-w-3xl mx-auto">
          {comboChart.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold pt-1">
          {comboChart.packageSize && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-0.5 rounded-full">
              ✨ {comboChart.packageSize}
            </span>
          )}
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300/80 px-3 py-0.5 rounded-full">
            {shapeLabel}
          </span>
          {savingsAmount > 0 && (
            <span className="bg-rose-500 text-white px-3 py-0.5 rounded-full shadow-xs">
              সাশ্রয় ৳{savingsAmount.toLocaleString('bn-BD')}
            </span>
          )}
        </div>
      </div>

      {/* 3. The Dedicated Combo Chart (Rendered in its Exact Admin-Chosen Shape) */}
      <div className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
        <ProductComboChart
          comboCharts={[comboChart]}
          shape={comboChart.shape || 'circle'}
          showSizeControls={true}
          showShapeControls={false}
          onSelectProduct={onQuickView}
          onBuyCombo={(chart, prods) => {
            if (prods.length > 0) {
              onBuyNow(createComboProductItem(chart, prods));
            }
          }}
        />
      </div>

      {/* 4. Instant Action Bar for Facebook Ad Visitors */}
      <div className="max-w-lg mx-auto px-2 sm:px-4 mt-6 sm:mt-8 flex flex-col items-center justify-center">
        
        {/* Ultra-Refined Luxury Scarcity & Countdown Pill */}
        <div className="w-full mb-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-sm flex items-center justify-between gap-2 transition-all">
          {/* Left: Stock Scarcity Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/90 text-[10.5px] sm:text-xs font-black shrink-0 shadow-2xs">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 fill-rose-500 animate-pulse" />
              <span>মাত্র {stockCountBn}টি বাকি</span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-stone-600 truncate hidden xs:inline sm:inline">
              আজকের ডিসকাউন্ট স্টক
            </span>
          </div>

          {/* Right: Digital Timer Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 hidden sm:inline">
              অফার শেষ হতে:
            </span>
            <div className="inline-flex items-center gap-1 bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-mono font-black tracking-wider shadow-2xs border border-stone-800">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="tabular-nums">{countdownStr}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOrderEntireCombo}
          className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#063828] via-[#094d38] to-[#04281d] text-white py-2 px-3 sm:py-3.5 sm:px-5 shadow-[0_10px_25px_-5px_rgba(6,56,40,0.5)] hover:shadow-[0_16px_35px_-4px_rgba(6,56,40,0.65)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-emerald-500/40 ring-1 sm:ring-2 ring-emerald-400/25"
        >
          {/* Animated Light Sweep Shimmer Effect on Hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

          <div className="relative flex items-center justify-between gap-2 sm:gap-3.5 w-full">
            <div className="flex items-center gap-2 sm:gap-3 text-left min-w-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-sm ring-1 sm:ring-2 ring-amber-200/50 group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950/20 text-stone-950" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 leading-tight">
                  <span className="text-[13px] sm:text-base font-black text-white tracking-tight truncate group-hover:text-amber-200 transition-colors">
                    {isOrderFeedback ? 'অর্ডার প্রস্তুত হচ্ছে...' : 'সম্পূর্ণ কম্বো এখনই নিন'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0 hidden sm:inline" />
                </div>
                <span className="text-[10px] sm:text-xs text-emerald-200/80 font-medium leading-none mt-0.5 truncate">
                  ক্যাশ অন ডেলিভারি
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 bg-black/35 backdrop-blur-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-amber-400/35 shrink-0">
              <div className="flex flex-col items-end leading-none">
                <div className="flex items-baseline gap-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/90 hidden xs:inline sm:inline">অফার</span>
                  <span className="text-sm sm:text-lg font-black text-amber-300 tracking-tight">
                    ৳{comboChart.price.toLocaleString('bn-BD')}
                  </span>
                </div>
                {savingsAmount > 0 && (
                  <span className="text-[8.5px] sm:text-[10px] font-black text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-1.5 py-0.2 rounded-full mt-0.5 leading-tight">
                    সাশ্রয় ৳{savingsAmount.toLocaleString('bn-BD')}
                  </span>
                )}
              </div>

              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-stone-950 text-white flex items-center justify-center transition-all duration-300 shrink-0">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        <div className="flex items-center justify-center gap-x-3 gap-y-1 mt-2 text-[10.5px] sm:text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ক্যাশ অন ডেলিভারি
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            পণ্য দেখে মূল্য পরিশোধ
          </span>
        </div>
      </div>

      {/* 5. Four Key Prominent Guarantee Badges */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm">
          {/* 1. ক্যাশ অন ডেলিভারি */}
          <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs border border-emerald-200/60">
              <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 leading-tight">ক্যাশ অন ডেলিভারি</p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 truncate">পণ্য দেখে মূল্য পরিশোধ</p>
            </div>
          </div>

          {/* 2. ৭ দিনের রিটার্ন */}
          <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200/60">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 leading-tight">৭ দিনের রিটার্ন</p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 truncate">সহজ এক্সচেঞ্জ পলিসি</p>
            </div>
          </div>

          {/* 3. অরিজিনাল প্রোডাক্ট গ্যারান্টি */}
          <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center shrink-0 shadow-2xs border border-purple-200/60">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 leading-tight truncate">অরিজিনাল প্রোডাক্ট গ্যারান্টি</p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 truncate">১০০% আসল ও খাঁটি পণ্য</p>
            </div>
          </div>

          {/* 4. ডেলিভারি ২-৫ দিন */}
          <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 shadow-2xs border border-teal-200/60">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 leading-tight">ডেলিভারি ২-৫ দিন</p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 truncate">সারাদেশে নিরাপদ শিপিং</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Other Active Combos (if any) */}
      {allComboCharts.filter((c) => c.id !== comboId).length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>আমাদের আরও কিছু স্পেশাল কম্বো অফার</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allComboCharts
              .filter((c) => c.id !== comboId)
              .slice(0, 2)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.search = `?combo=${c.id}`;
                    }
                  }}
                  className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-emerald-600/50 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {c.packageSize || 'স্পেশাল কম্বো'}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      {c.title}
                    </h4>
                    <p className="text-base font-black text-rose-600 font-mono">
                      ৳{c.price.toLocaleString('bn-BD')}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 bg-stone-100 hover:bg-emerald-700 hover:text-white rounded-xl text-xs font-bold text-stone-700 transition shrink-0">
                    দেখুন →
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 7. Explore Other Store Products */}
      {otherProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-stone-900">
              শপের অন্যান্য জনপ্রিয় কালেকশন
            </h3>
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              সব প্রোডাক্ট দেখুন →
            </button>
          </div>

          <ProductSection
            title=""
            products={otherProducts}
            onBuyNow={onBuyNow}
            onQuickView={onQuickView}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
          />
        </div>
      )}

    </main>
  );
};
