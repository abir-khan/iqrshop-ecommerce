import React, { useState, useEffect, useMemo } from 'react';
import { ShowcaseHeroBanner } from './ShowcaseHeroBanner';
import { CustomerReviews } from './CustomerReviews';
import { TrustBar } from './TrustBar';
import { Newsletter } from './Newsletter';
import { ProductComboChart } from './ProductComboChart';
import { ProductCard } from './ProductCard';
import { createComboProductItem, fetchActiveComboCharts } from '../lib/comboChartService';
import { useCms } from '../context/CmsContext';
import { DEFAULT_HOME_SECTIONS } from '../data/defaultCmsData';
import type { Product, ComboChart } from '../types';
import { Sparkles, ArrowRight, ChevronDown, Grid } from 'lucide-react';

interface BelieverShowcaseHomeProps {
  onSelectCategory: (categoryId: string) => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const BelieverShowcaseHome: React.FC<BelieverShowcaseHomeProps> = ({
  onSelectCategory,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { data } = useCms();
  const products = data.products;

  // Active combo charts loaded from DB/cache to resolve the featured combo
  const [comboCharts, setComboCharts] = useState<ComboChart[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboChart | null>(null);

  useEffect(() => {
    fetchActiveComboCharts().then((charts) => {
      setComboCharts(charts);
    });
  }, []);

  // Determine active featured combo based on user selection or Admin's selection (siteSettings.featuredComboId)
  const featuredCombo = useMemo(() => {
    if (selectedCombo) return selectedCombo;
    const targetId = data.siteSettings.featuredComboId;
    if (targetId && comboCharts.length > 0) {
      const found = comboCharts.find((c) => c.id === targetId);
      if (found) return found;
    }
    return comboCharts[0] || null;
  }, [selectedCombo, data.siteSettings.featuredComboId, comboCharts]);

  // The category belonging to the selected combo
  const featuredCategoryId = featuredCombo?.categoryId || 'organic';
  const featuredCategoryObj = data.categories.find((c) => c.id === featuredCategoryId) || {
    id: featuredCategoryId,
    name: 'প্রিমিয়াম কালেকশন',
    icon: '✨',
  };

  // Products belonging exclusively to this featured combo's category
  const featuredCategoryProducts = useMemo(() => {
    return products.filter((p) => {
      if (featuredCategoryId === 'gift' || featuredCategoryId === 'deals') {
        return p.category === 'gift' || p.category === 'deals';
      }
      return p.category === featuredCategoryId;
    });
  }, [products, featuredCategoryId]);

  // Initial products limit (default: 8, configured in siteSettings)
  const initialLimit = data.siteSettings.featuredProductsLimit || 8;
  const displayedProducts = showAllProducts
    ? featuredCategoryProducts
    : featuredCategoryProducts.slice(0, initialLimit);

  // Remaining categories for the compact quick explore grid
  const otherCategories = useMemo(() => {
    return data.categories.filter((c) => c.id !== 'all' && c.id !== featuredCategoryId);
  }, [data.categories, featuredCategoryId]);

  const rawSections = (data.homeSections && data.homeSections.length > 0)
    ? [...data.homeSections].sort((a, b) => a.order - b.order)
    : DEFAULT_HOME_SECTIONS;

  // Ensure combo_chart is rendered even if older cache exists
  const activeHomeSections = useMemo(() => {
    const list = [...rawSections];
    if (!list.some((s) => s.id === 'combo_chart')) {
      const insertIdx = list.findIndex((s) => s.id === 'category_sections');
      const comboSec: import('../types/cms').HomeSectionItem = {
        id: 'combo_chart',
        name: 'সার্কুলার কম্বো চার্ট অফার',
        description: 'পাই-চার্ট ডিজাইনে সাজানো আকর্ষণীয় কম্বো প্যাকেজ ও অফার',
        enabled: true,
        order: 3.5,
      };
      if (insertIdx !== -1) {
        list.splice(insertIdx, 0, comboSec);
      } else {
        list.push(comboSec);
      }
    }
    return list;
  }, [rawSections]);

  return (
    <div className="space-y-4 sm:space-y-12 lg:space-y-16 pb-6 sm:pb-20 font-sans">
      {activeHomeSections
        .filter((sec) => sec.enabled !== false && sec.id !== 'category_nav' && sec.id !== 'showroom_strip')
        .map((sec) => {
          switch (sec.id) {
            case 'hero':
              return <ShowcaseHeroBanner key="hero" onSelectCategory={onSelectCategory} />;

            case 'combo_chart':
              return (
                <section key="combo_chart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
                  <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full shadow-2xs">
                      {data.siteSettings.comboSectionBadge || '✨ এক্সক্লুসিভ প্যাকেজ'}
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black text-stone-900 mt-2">
                      {data.siteSettings.comboSectionTitle || sec.name || 'সার্কুলার কম্বো চার্ট অফার'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
                      {data.siteSettings.comboSectionSubtitle || sec.description || 'প্যাকেজের যেকোনো আইটেমে হোভার করে বিস্তারিত দেখুন এবং আকর্ষণীয় ছাড়ে পুরো সেট অর্ডার করুন'}
                    </p>
                  </div>
                  <ProductComboChart
                    comboCharts={comboCharts.length > 0 ? comboCharts : undefined}
                    activeComboId={featuredCombo?.id || data.siteSettings.featuredComboId}
                    onActiveChartChange={(chart) => setSelectedCombo(chart)}
                    onSelectProduct={onQuickView}
                    onBuyCombo={(chart, prods) => {
                      if (prods.length > 0) {
                        onBuyNow(createComboProductItem(chart, prods));
                      }
                    }}
                  />
                </section>
              );

            case 'category_sections':
            case 'products' as any:
              return (
                <div key={sec.id} className="space-y-6 sm:space-y-10">
                  {/* 1. Featured Category Products Section (Directly matching Admin's chosen combo) */}
                  <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/80 pb-3 sm:pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] sm:text-xs font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{featuredCategoryObj.name} স্পেশাল কালেকশন</span>
                          </span>
                          <span className="text-xs text-zinc-500 font-medium">
                            ({featuredCategoryProducts.length} টি পণ্য)
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
                          {featuredCombo ? `${featuredCombo.title} — সংশ্লিষ্ট কালেকশন` : 'নির্বাচিত সেরা পণ্যসমূহ'}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-500">
                          এই অফার প্যাকেজের সাথে মানানসই ও জনপ্রিয় শীর্ষ পণ্যগুলো এক নজরে দেখুন
                        </p>
                      </div>

                      <button
                        onClick={() => onSelectCategory(featuredCategoryId)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer self-start sm:self-auto group"
                      >
                        <span>এই ক্যাটাগরির ফিল্টার পেজ</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Products Grid (2 cols on mobile, 4 cols on desktop) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
                      {displayedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onBuyNow={onBuyNow}
                          onQuickView={onQuickView}
                          isWishlisted={wishlistIds.includes(product.id)}
                          onToggleWishlist={onToggleWishlist}
                        />
                      ))}
                    </div>

                    {/* Show More Expander if products exceed initial limit */}
                    {featuredCategoryProducts.length > initialLimit && !showAllProducts && (
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={() => setShowAllProducts(true)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#13231B] hover:bg-[#1f372a] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer group"
                        >
                          <span>আরও পণ্য দেখুন (+{featuredCategoryProducts.length - initialLimit}টি বাকি)</span>
                          <ChevronDown className="w-4 h-4 text-amber-300 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </section>

                  {/* 2. Explore Other Categories (Compact, Non-Intrusive, Mobile-Friendly) */}
                  <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="bg-[#f7f8f8] border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Grid className="w-4 h-4 text-emerald-800" />
                          <h4 className="text-sm sm:text-base font-black text-zinc-900">
                            অন্যান্য ক্যাটাগরি
                          </h4>
                        </div>
                        <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">

                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                        {otherCategories.map((cat) => {
                          const catProductCount = products.filter((p) => p.category === cat.id).length;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => onSelectCategory(cat.id)}
                              className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 hover:border-emerald-700/50 hover:shadow-xs transition-all cursor-pointer text-left group active:scale-95"
                            >
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform shrink-0">
                                {cat.icon || '🛍️'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs sm:text-[13px] font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors truncate">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-medium block">
                                  {catProductCount > 0 ? `${catProductCount}টি পণ্য` : 'কালেকশন দেখুন'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                </div>
              );

            case 'reviews':
              return (
                <div key="reviews" id="reviews">
                  <CustomerReviews />
                </div>
              );

            case 'trust':
              return (
                <div key="trust" id="trust">
                  <TrustBar />
                </div>
              );

            case 'newsletter':
              return (
                <div key="newsletter" id="newsletter">
                  <Newsletter />
                </div>
              );

            default:
              return null;
          }
        })}
    </div>
  );
};

