import React from 'react';
import { ShowcaseHeroBanner } from './ShowcaseHeroBanner';
import { ShowcaseCategorySection } from './ShowcaseCategorySection';
import { CustomerReviews } from './CustomerReviews';
import { TrustBar } from './TrustBar';
import { Newsletter } from './Newsletter';
import { ProductComboChart } from './ProductComboChart';
import { createComboProductItem } from '../lib/comboChartService';
import { useCms } from '../context/CmsContext';
import { DEFAULT_HOME_SECTIONS } from '../data/defaultCmsData';
import type { Product } from '../types';
import type { CategoryBannerConfig } from './ShowcaseCategoryBanner';

interface BelieverShowcaseHomeProps {
  onSelectCategory: (categoryId: string) => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

const CATEGORY_BANNERS: Record<string, CategoryBannerConfig> = {
  panjabi: {
    id: 'banner-panjabi',
    categoryId: 'panjabi',
    englishTitle: 'PANJABI',
    banglaTitle: 'সুন্নতি পাঞ্জাবি ও টুপি কালেকশন',
    tagline: '১০০% সফট ফাইন কটন ও জ্যাকার্ড উইভিং লাক্সারি ডিজাইন',
    badge: 'LUXURY COLLECTION',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#f5ede2] via-[#ede0cf] to-[#decbb3]',
    accentColor: '#78350f',
    textColor: '#2c1e11',
    badgeBg: '#fef3c7',
    buttonText: 'পাঞ্জাবি কালেকশন দেখুন',
  },
  attar: {
    id: 'banner-attar',
    categoryId: 'attar',
    englishTitle: 'ATTAR & OUD',
    banglaTitle: 'প্রিমিয়াম অ্যালকোহলমুক্ত আতর',
    tagline: 'রাজকীয় এরাবিয়ান ওউদ ও শান্ত কস্তুরীর দীর্ঘস্থায়ী মনমাতানো সুবাস',
    badge: '100% PURE FRAGRANCE',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#e6f9f0] via-[#d1f4e3] to-[#b6ebd0]',
    accentColor: '#065f46',
    textColor: '#064e3b',
    badgeBg: '#d1fae5',
    buttonText: 'আতর কালেকশন দেখুন',
  },
  janamaz: {
    id: 'banner-janamaz',
    categoryId: 'janamaz',
    englishTitle: 'JANAMAZ',
    banglaTitle: 'তুর্কি অর্থোপেডিক জায়নামাজ',
    tagline: 'হাঁটু ও জয়েন্টের আরামদায়ক কুশনিং ও সফট ভেলভেট ফ্যাব্রিক',
    badge: 'COMFORT IN SALAH',
    image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#e0f2fe] via-[#bae6fd] to-[#93c5fd]',
    accentColor: '#0369a1',
    textColor: '#0c4a6e',
    badgeBg: '#e0f2fe',
    buttonText: 'জায়নামাজ দেখুন',
  },
  tasbih: {
    id: 'banner-tasbih',
    categoryId: 'tasbih',
    englishTitle: 'SMART TASBIH',
    banglaTitle: 'ডিজিটাল স্মার্ট তসবিহ ও গ্যাজেট',
    tagline: 'ভাইব্রেশন অ্যালার্ট, এলইডি ডিসপ্লে ও প্রাকৃতিক চন্দন কাঠ',
    badge: 'SMART ZIKR GADGET',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]',
    accentColor: '#334155',
    textColor: '#1e293b',
    badgeBg: '#e2e8f0',
    buttonText: 'তসবিহ কালেকশন দেখুন',
  },
  organic: {
    id: 'banner-organic',
    categoryId: 'organic',
    englishTitle: 'SUNNAH FOODS',
    banglaTitle: 'খেজুর ও চাকের মধু',
    tagline: 'শতভাগ প্রাকৃতিক, অপরিশোধিত ও পুষ্টিকর সুন্নাহ ডায়েট',
    badge: '100% NATURAL & ORGANIC',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fcd34d]',
    accentColor: '#92400e',
    textColor: '#78350f',
    badgeBg: '#fef9c3',
    buttonText: 'সুন্নাহ ফুড দেখুন',
  },
  gift: {
    id: 'banner-gift',
    categoryId: 'gift',
    englishTitle: 'EXCLUSIVE COMBO',
    banglaTitle: 'এক্সক্লুসিভ কম্বো ও গিফট প্যাকেজ',
    tagline: 'পাঞ্জাবি, আতর, তসবিহ ও জায়নামাজের আকর্ষণীয় গিফট বক্স',
    badge: 'SAVE UP TO 25%',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    bgGradient: 'bg-gradient-to-r from-[#fae8ff] via-[#f5d0fe] to-[#e879f9]',
    accentColor: '#86198f',
    textColor: '#701a75',
    badgeBg: '#fae8ff',
    buttonText: 'কম্বো অফার দেখুন',
  },
};

export const BelieverShowcaseHome: React.FC<BelieverShowcaseHomeProps> = ({
  onSelectCategory,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { data } = useCms();
  const products = data.products;
  const categoryBanners = (data.categoryBanners && data.categoryBanners.length > 0)
    ? data.categoryBanners
    : Object.values(CATEGORY_BANNERS);

  const rawSections = (data.homeSections && data.homeSections.length > 0)
    ? [...data.homeSections].sort((a, b) => a.order - b.order)
    : DEFAULT_HOME_SECTIONS;

  // Ensure combo_chart is rendered even if older cache exists
  const activeHomeSections = React.useMemo(() => {
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
                      ✨ এক্সক্লুসিভ প্যাকেজ
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black text-stone-900 mt-2">
                      সার্কুলার কম্বো চার্ট অফার
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
                      প্যাকেজের যেকোনো আইটেমে হোভার করে বিস্তারিত দেখুন এবং আকর্ষণীয় ছাড়ে পুরো সেট অর্ডার করুন
                    </p>
                  </div>
                  <ProductComboChart
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
              return (
                <div key="category_sections" className="space-y-4 sm:space-y-12 lg:space-y-16">
                  {categoryBanners
                    .filter((banner) => banner.enabled !== false)
                    .map((banner) => {
                      const categoryProducts = products.filter((p) => {
                        if (banner.categoryId === 'gift') {
                          return p.category === 'gift' || p.category === 'deals';
                        }
                        return p.category === banner.categoryId;
                      });

                      if (categoryProducts.length === 0) return null;

                      return (
                        <ShowcaseCategorySection
                          key={banner.id || banner.categoryId}
                          bannerConfig={banner}
                          products={categoryProducts}
                          onSelectCategory={onSelectCategory}
                          onBuyNow={onBuyNow}
                          onQuickView={onQuickView}
                          wishlistIds={wishlistIds}
                          onToggleWishlist={onToggleWishlist}
                          maxDisplay={4}
                        />
                      );
                    })}
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
