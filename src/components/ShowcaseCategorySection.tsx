import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCategoryBanner, type CategoryBannerConfig } from './ShowcaseCategoryBanner';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ShowcaseCategorySectionProps {
  bannerConfig: CategoryBannerConfig;
  products: Product[];
  onSelectCategory: (categoryId: string) => void;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  maxDisplay?: number;
}

export const ShowcaseCategorySection: React.FC<ShowcaseCategorySectionProps> = ({
  bannerConfig,
  products,
  onSelectCategory,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  maxDisplay = 4,
}) => {
  const displayProducts = products.slice(0, maxDisplay);

  if (products.length === 0) return null;

  return (
    <section className="py-2 sm:py-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-6">
      {/* 1. Believer-Inspired Full-Width Category Banner */}
      <ShowcaseCategoryBanner
        config={bannerConfig}
        onSelectCategory={onSelectCategory}
        totalProducts={products.length}
      />

      {/* 2. Responsive Product Grid (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
        {displayProducts.map((product) => (
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

      {/* 3. Bottom 'View All' Pill for mobile and desktop */}
      <div className="flex justify-center pt-1 sm:pt-2">
        <button
          onClick={() => onSelectCategory(bannerConfig.categoryId)}
          className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <span>{bannerConfig.banglaTitle} এর সব প্রোডাক্ট দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
