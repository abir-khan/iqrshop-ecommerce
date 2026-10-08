import React from 'react';
import { ShowcaseHeroBanner } from './ShowcaseHeroBanner';
import { ShowcaseCategoryNav } from './ShowcaseCategoryNav';
import { ShowcaseShowroomStrip } from './ShowcaseShowroomStrip';
import { ShowcaseCategorySection } from './ShowcaseCategorySection';
import { CustomerReviews } from './CustomerReviews';
import { TrustBar } from './TrustBar';
import { Newsletter } from './Newsletter';
import { useCms } from '../context/CmsContext';
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
    banglaTitle: 'মদিনার আজওয়া খেজুর ও চাকের মধু',
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

  return (
    <div className="space-y-4 sm:space-y-12 lg:space-y-16 pb-6 sm:pb-20 font-sans">
      {/* 1. Main Top Hero Banner */}
      <ShowcaseHeroBanner onSelectCategory={onSelectCategory} />

      {/* 2. Top Categories Circle Nav Bar */}
      <ShowcaseCategoryNav onSelectCategory={onSelectCategory} />

      {/* 3. Showroom & Gift Strip */}
      <ShowcaseShowroomStrip onSelectCategory={onSelectCategory} />

      {/* 4. Dynamic Showcase Category Sections from CMS */}
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

      {/* 5. Verified Customer Reviews */}
      <div id="reviews">
        <CustomerReviews />
      </div>

      {/* 6. Trust Guarantee Bar */}
      <div id="trust">
        <TrustBar />
      </div>

      {/* 7. Newsletter Strip */}
      <Newsletter />
    </div>
  );
};
