import React, { useMemo } from 'react';
import { Hero } from './Hero';
import { CategoryCircleBar } from './CategoryCircleBar';
import { ProductSection } from './ProductSection';
import { DualPromoBanners } from './DualPromoBanners';
import { CustomerReviews } from './CustomerReviews';
import { TrustBar } from './TrustBar';
import { Newsletter } from './Newsletter';
import { useCms } from '../context/CmsContext';
import type { Product } from '../types';

interface ClassicHomeProps {
  onSelectCategory: (categoryId: string) => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ClassicHome: React.FC<ClassicHomeProps> = ({
  onSelectCategory,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { data } = useCms();
  const productsList = data.products;

  const featuredProducts = useMemo(() => {
    const populars = productsList.filter((p) => p.isPopular || p.badge?.includes('সেলার'));
    return populars.length >= 3 ? populars.slice(0, 4) : productsList.slice(0, 4);
  }, [productsList]);

  const newArrivalsProducts = useMemo(() => {
    const news = productsList.filter((p) => p.badge?.includes('নতুন') || p.category === 'panjabi');
    return news.length >= 3 ? news.slice(0, 4) : productsList.slice(2, 6);
  }, [productsList]);

  const bestSellersProducts = useMemo(() => {
    const bests = productsList.filter((p) => p.badge?.includes('বেস্ট') || p.badge?.includes('প্রিমিয়াম'));
    return bests.length >= 3 ? bests.slice(0, 4) : productsList.slice(4, 8);
  }, [productsList]);

  return (
    <div className="space-y-1.5 sm:space-y-16 lg:space-y-24 pb-2 sm:pb-20">
      {/* 1. Bento Hero Section */}
      <Hero onSelectCategory={onSelectCategory} />

      {/* 2. Circular Categories Pastel Bar */}
      <CategoryCircleBar
        selectedCategory="all"
        onSelectCategory={onSelectCategory}
      />

      {/* 3. Section 1: Featured Products (বাছাইকৃত পণ্যসমূহ) */}
      <ProductSection
        id="featured"
        title="বাছাইকৃত পণ্যসমূহ"
        subtitle="আমাদের শীর্ষ মানসম্মত জনপ্রিয় কালেকশন"
        products={featuredProducts}
        onBuyNow={onBuyNow}
        onQuickView={onQuickView}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onViewAll={() => onSelectCategory('all')}
      />

      {/* 4. Dual Promotional Banners */}
      <div id="deals">
        <DualPromoBanners onSelectCategory={onSelectCategory} />
      </div>

      {/* 5. Section 2: New Arrivals (নতুন কালেকশন) */}
      <ProductSection
        id="new-arrivals"
        title="নতুন কালেকশন"
        subtitle="সদ্য যুক্ত হওয়া প্রিমিয়াম পণ্যসমূহ"
        products={newArrivalsProducts}
        onBuyNow={onBuyNow}
        onQuickView={onQuickView}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onViewAll={() => onSelectCategory('panjabi')}
      />

      {/* 6. Section 3: Best Sellers (সর্বোচ্চ বিক্রিত পণ্য) */}
      <ProductSection
        id="best-sellers"
        title="বেস্ট সেলার পণ্যসমূহ"
        subtitle="গ্রাহকদের সবচেয়ে পছন্দের পণ্য তালিকা"
        products={bestSellersProducts}
        onBuyNow={onBuyNow}
        onQuickView={onQuickView}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onViewAll={() => onSelectCategory('attar')}
      />

      {/* 7. Verified Customer Reviews Section */}
      <div id="reviews">
        <CustomerReviews />
      </div>

      {/* 8. Why Shop With Us? Trust Guarantee Section */}
      <div id="trust">
        <TrustBar />
      </div>

      {/* 9. Join Our Community Newsletter Strip */}
      <Newsletter />
    </div>
  );
};
