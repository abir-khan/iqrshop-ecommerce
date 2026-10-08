import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Eye,
  CheckCircle2,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { ProductGridSkeleton } from './SkeletonLoader';
import type { Product } from '../types';
import { useCms } from '../context/CmsContext';

interface CategoryViewProps {
  initialCategory: string;
  onBackToHome: () => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  initialCategory,
  onBackToHome,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { data } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync selectedCategory when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Trigger brief shimmer skeleton transition and reset pagination when changing filter/category
  useEffect(() => {
    setIsLoading(true);
    setVisibleCount(6);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSize, selectedPriceRange, sortBy, onlyInStock]);

  // Per-card selected size state
  const [cardSizes, setCardSizes] = useState<Record<string, string>>({});

  // Size list for clothing/caps
  const AVAILABLE_SIZES = ['38', '40', '42', '44', '46', '21', '22'];

  const PRICE_RANGES = [
    { id: 'all', label: 'সকল মূল্য' },
    { id: 'under-500', label: '৳৫০০ এর নিচে' },
    { id: '500-1000', label: '৳৫০০ — ৳১,০০০' },
    { id: '1000-2000', label: '৳১,০০০ — ৳২,০০০' },
    { id: 'above-2000', label: '৳২,০০০ এর বেশি' },
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return data.products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'deals') {
          // Special deals: products with category deals/gift or having originalPrice discount
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          if (product.category !== 'deals' && product.category !== 'gift' && !hasDiscount) {
            return false;
          }
        } else if (selectedCategory === 'gift') {
          if (product.category !== 'gift' && product.category !== 'deals') {
            return false;
          }
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all') {
        if (!product.sizes || !product.sizes.includes(selectedSize)) {
          return false;
        }
      }

      // Price filter
      if (selectedPriceRange === 'under-500' && product.price >= 500) return false;
      if (selectedPriceRange === '500-1000' && (product.price < 500 || product.price > 1000)) return false;
      if (selectedPriceRange === '1000-2000' && (product.price < 1000 || product.price > 2000)) return false;
      if (selectedPriceRange === 'above-2000' && product.price <= 2000) return false;

      // In stock
      if (onlyInStock && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [data.products, selectedCategory, selectedSize, selectedPriceRange, sortBy, onlyInStock]);

  const activeCategoryObj =
    data.categories.find((c) => c.id === selectedCategory) ||
    (selectedCategory === 'deals'
      ? { id: 'deals', name: 'স্পেশাল ডিল ও অফার', icon: '⚡' }
      : selectedCategory === 'gift'
      ? { id: 'gift', name: 'গিফট কম্বো ও প্যাকেজ', icon: '🎁' }
      : { id: 'all', name: 'সকল পণ্য', icon: '✨' });

  const handleCardSizeSelect = (productId: string, size: string) => {
    setCardSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleOrderClick = (product: Product) => {
    const chosenSize = cardSizes[product.id] || (product.sizes ? product.sizes[0] : undefined);
    onBuyNow(product, chosenSize);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedPriceRange('all');
    setSortBy('popular');
    setOnlyInStock(false);
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  return (
    <div className="bg-white min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3.5 border-b border-zinc-200/80">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 font-medium">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 font-semibold text-[#13231B] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>হোমপেজ</span>
            </button>
            <span className="text-zinc-400">/</span>
            <span className="font-bold text-zinc-900">
              {activeCategoryObj.name}
            </span>
            <span className="bg-zinc-100 text-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-200">
              {filteredProducts.length} টি পণ্য
            </span>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-zinc-700 hover:text-[#13231B] bg-zinc-50 border border-zinc-200 hover:border-zinc-300 px-3.5 py-1.5 rounded-full transition"
          >
            ← হোমপেজে ফিরুন
          </button>
        </div>

        {/* Category Horizontal Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 mb-3.5 scroll-smooth">
          {data.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#13231B] text-amber-300 shadow-md ring-2 ring-emerald-800/40 border border-emerald-600 scale-[1.03]'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200/90 hover:text-zinc-950'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Filter & Sort Prominent Sticky Bar (Stays pinned when scrolling) */}
        <div className="lg:hidden sticky top-[57px] z-20 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-zinc-200/90 shadow-md mb-3.5 transition-all">
          {/* Prominent Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#13231B] bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 px-3 py-2 rounded-xl shadow-2xs active:scale-95 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
            <span>ফিল্টার</span>
            {activeFiltersCount > 0 ? (
              <span className="bg-emerald-800 text-amber-300 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-2xs">
                {activeFiltersCount}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-zinc-400">({filteredProducts.length})</span>
            )}
          </button>

          {/* Prominent Sort Dropdown */}
          <div className="flex-1 flex items-center justify-center gap-1 bg-zinc-50 border border-zinc-300 px-2.5 py-2 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="পণ্য সাজান"
              className="w-full bg-transparent text-xs font-bold text-zinc-900 focus:outline-none cursor-pointer truncate"
            >
              <option value="popular">জনপ্রিয় পণ্য</option>
              <option value="price-asc">দাম: কম ➔ বেশি</option>
              <option value="price-desc">দাম: বেশি ➔ কম</option>
              <option value="rating">সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* LEFT DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            <div className="bg-[#FAFAF9] rounded-2xl p-4.5 border border-zinc-200/80 space-y-5 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-[#13231B]" />
                  <span>ফিল্টার অপশন</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    রিসেট
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-900 block">
                  ক্যাটাগরি
                </label>
                <div className="space-y-1">
                  {data.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl text-left transition-all font-semibold ${
                        selectedCategory === cat.id
                          ? 'bg-[#13231B] text-amber-300 shadow-xs border border-emerald-700 font-bold'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-200/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900">
                    সাইজ সিলেক্টর (পাঞ্জাবি)
                  </label>
                  {selectedSize !== 'all' && (
                    <button
                      onClick={() => setSelectedSize('all')}
                      className="text-[10px] text-zinc-500 underline"
                    >
                      সব
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`text-xs font-semibold py-1.5 rounded-lg border transition ${
                      selectedSize === 'all'
                        ? 'bg-[#13231B] text-white border-[#13231B]'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    সব
                  </button>
                  {AVAILABLE_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs font-semibold py-1.5 rounded-lg border transition ${
                        selectedSize === sz
                          ? 'bg-[#13231B] text-white border-[#13231B]'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2 pt-2 border-t border-zinc-200/60">
                <label className="text-xs font-bold text-zinc-900 block">
                  মূল্য পরিসীমা
                </label>
                <div className="space-y-1">
                  {PRICE_RANGES.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-zinc-700 font-medium cursor-pointer hover:text-zinc-950 py-1"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRange === p.id}
                        onChange={() => setSelectedPriceRange(p.id)}
                        className="accent-[#13231B]"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In-Stock Switch */}
              <div className="pt-2 border-t border-zinc-200/60">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-zinc-800">
                    ইন-স্টক পণ্য
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#13231B] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* RIGHT PRODUCTS GRID */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Desktop Sort Bar */}
            <div className="hidden lg:flex items-center justify-between bg-[#FAFAF9] px-4 py-2.5 rounded-2xl border border-zinc-200/80">
              <span className="text-xs font-medium text-zinc-600">
                মোট <strong className="text-zinc-900 font-bold">{filteredProducts.length}</strong> টি পণ্য পাওয়া গেছে
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-500">সাজান:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      sortBy === 'popular'
                        ? 'bg-[#13231B] text-white'
                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                    }`}
                  >
                    জনপ্রিয়
                  </button>
                  <button
                    onClick={() => setSortBy('price-asc')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      sortBy === 'price-asc'
                        ? 'bg-[#13231B] text-white'
                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                    }`}
                  >
                    দাম: কম ➔ বেশি
                  </button>
                  <button
                    onClick={() => setSortBy('price-desc')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      sortBy === 'price-desc'
                        ? 'bg-[#13231B] text-white'
                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                    }`}
                  >
                    দাম: বেশি ➔ কম
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      sortBy === 'rating'
                        ? 'bg-[#13231B] text-white'
                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                    }`}
                  >
                    রেটিং
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#FAFAF9] rounded-3xl p-10 text-center border border-zinc-200 space-y-3">
                <span className="text-4xl">🔍</span>
                <h3 className="text-base font-bold text-zinc-900">
                  কোনো পণ্য পাওয়া যায়নি!
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  অন্য কোনো সাইজ বা ক্যাটাগরি বেছে নিন অথবা ফিল্টার রিসেট করুন।
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#13231B] text-white text-xs font-semibold py-2 px-5 rounded-full shadow-sm hover:bg-[#1f372a] transition"
                >
                  সব ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {filteredProducts.slice(0, visibleCount).map((product) => {
                    const isWishlisted = wishlistIds.includes(product.id);
                    const selectedProductSize = cardSizes[product.id] || (product.sizes ? product.sizes[0] : null);

                    return (
                      <div
                        key={product.id}
                        onClick={() => onQuickView(product)}
                        className="bg-white rounded-xl sm:rounded-3xl border border-zinc-200/80 hover:border-emerald-700/50 p-1 sm:p-3.5 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex flex-col justify-between group h-full cursor-pointer active:scale-[0.99] min-w-0"
                      >
                        {/* Product Image Box (Consistent 1:1 Aspect Ratio) */}
                        <div className="relative aspect-square w-full bg-[#f4f5f6] rounded-lg sm:rounded-2xl overflow-hidden mb-1 sm:mb-2 border border-stone-200/70 shadow-2xs flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Badges (Sleek, Minimal Non-Intrusive Pills) */}
                          <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 z-10">
                            {product.badge && (
                              <span className="bg-[#13231B]/90 backdrop-blur-2xs text-amber-300 text-[7px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                                {product.badge}
                              </span>
                            )}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="bg-rose-600/90 backdrop-blur-2xs text-white text-[7px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                                ৳{product.originalPrice - product.price} ছাড়
                              </span>
                            )}
                          </div>

                          {/* Wishlist & Quick View */}
                          <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex flex-col gap-0.5 sm:gap-1 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(product.id);
                              }}
                              className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center shadow-xs transition cursor-pointer active:scale-90 active:brightness-90"
                              title="উইশলিস্টে যোগ করুন"
                            >
                              <Heart
                                className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                                  isWishlisted ? 'text-rose-600 fill-rose-600' : ''
                                }`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickView(product);
                              }}
                              className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center shadow-xs transition cursor-pointer active:scale-90 active:brightness-90"
                              title="কুইক ভিউ"
                            >
                              <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-0.5 sm:space-y-1.5 flex-1 flex flex-col justify-between min-w-0 w-full overflow-hidden px-0.5">
                          <div className="min-w-0 w-full overflow-hidden">
                            {/* Rating & Stock Status (Combined in 1 Single Line) */}
                            <div className="flex items-center justify-between gap-1 mb-0.5 min-w-0 w-full overflow-hidden">
                              <div className="flex items-center gap-0.5 text-[8px] sm:text-xs text-amber-500 font-bold shrink-0 whitespace-nowrap">
                                <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                <span className="text-zinc-900">{product.rating}</span>
                                <span className="text-zinc-400 font-normal text-[7px] sm:text-[10px]">({product.reviewsCount})</span>
                              </div>
                              <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded shrink-0 whitespace-nowrap">
                                <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-600 shrink-0" />
                                <span>স্টকে আছে</span>
                              </span>
                            </div>

                            {/* 1-Line Truncated Title on Mobile */}
                            <h4 
                              className="font-bold text-zinc-900 text-[10px] sm:text-sm leading-tight truncate block w-full min-w-0 group-hover:text-emerald-800 transition-colors py-0.2" 
                              title={product.name}
                              style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {product.name}
                            </h4>
                          </div>

                          {/* In-Card Size Selector (Desktop: Quick selector, Mobile: Clean single line info) */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="pt-0.5 min-w-0">
                              {/* Desktop Buttons */}
                              <div className="hidden sm:block">
                                <span className="text-[11px] font-bold text-zinc-600 block mb-0.5">
                                  সাইজ:
                                </span>
                                <div className="flex items-center gap-0.5 flex-wrap">
                                  {product.sizes.map((sz) => (
                                    <button
                                      key={sz}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardSizeSelect(product.id, sz);
                                      }}
                                      className={`text-xs font-bold px-1.5 py-0.5 rounded border transition cursor-pointer active:scale-95 ${
                                        selectedProductSize === sz
                                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Mobile 1-Line Compact Badge */}
                              <div className="sm:hidden flex items-center justify-between text-[7.5px] font-bold text-zinc-500 py-0.2">
                                <span>সাইজ: <strong className="text-zinc-800">{product.sizes.join(', ')}</strong></span>
                              </div>
                            </div>
                          )}

                          {/* Price & Order */}
                          <div className="pt-0.5 sm:pt-1.5 border-t border-zinc-100 space-y-1 min-w-0">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10.5px] sm:text-base font-black text-zinc-900 shrink-0">
                                ৳{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[8px] sm:text-xs text-zinc-400 line-through font-normal shrink-0">
                                  ৳{product.originalPrice}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderClick(product);
                              }}
                              className="w-full text-center text-[8.5px] sm:text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 h-[22px] sm:h-[34px] py-0 px-1 sm:px-4 rounded sm:rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer active:scale-95 active:brightness-90 group/btn"
                            >
                              <ShoppingBag className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-amber-300" />
                              <span>অর্ডার করুন</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination: Load More Button */}
                {filteredProducts.length > visibleCount && (
                  <div className="pt-3 pb-1 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#13231B] hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      <span>আরও পণ্য লোড করুন ({Math.min(visibleCount, filteredProducts.length)} / {filteredProducts.length})</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end lg:hidden backdrop-blur-xs">
          <div className="bg-white w-full max-h-[88vh] rounded-t-3xl p-5 overflow-y-auto space-y-4 animate-in slide-in-from-bottom">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#13231B]" />
                <h3 className="font-bold text-zinc-900 text-base">ফিল্টার অপশন</h3>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    রিসেট করুন
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900">ক্যাটাগরি</label>
              <div className="grid grid-cols-2 gap-1.5">
                {data.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs py-2 px-3 rounded-xl font-bold border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#13231B] text-amber-300 border-[#13231B] shadow-xs'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-900">সাইজ (পাঞ্জাবি ও টুপি)</label>
                {selectedSize !== 'all' && (
                  <button
                    onClick={() => setSelectedSize('all')}
                    className="text-[10px] text-zinc-500 underline"
                  >
                    সব সাইজ
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`text-xs py-1.5 rounded-xl font-semibold border ${
                    selectedSize === 'all'
                      ? 'bg-[#13231B] text-white border-[#13231B]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  সকল
                </button>
                {AVAILABLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs py-1.5 rounded-xl font-semibold border ${
                      selectedSize === sz
                        ? 'bg-[#13231B] text-white border-[#13231B]'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
              <label className="text-xs font-bold text-zinc-900">মূল্য পরিসীমা</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_RANGES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPriceRange(p.id)}
                    className={`text-xs py-2 px-3 rounded-xl font-medium border text-left transition ${
                      selectedPriceRange === p.id
                        ? 'bg-[#13231B] text-amber-300 border-[#13231B] font-bold'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-zinc-100">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs font-bold text-zinc-800">শুধুমাত্র ইন-স্টক পণ্য</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-[#13231B] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#13231B] hover:bg-emerald-950 text-amber-300 font-bold text-xs py-3 rounded-xl shadow-md cursor-pointer active:scale-95 transition"
              >
                ফিল্টার প্রয়োগ করুন ({filteredProducts.length} টি পণ্য)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
