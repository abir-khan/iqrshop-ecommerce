import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onViewAll?: () => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  subtitle,
  products,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  onViewAll,
}) => {
  return (
    <section id={id} className="py-0 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Section Header */}
        <div className="flex items-end justify-between mb-1 sm:mb-5 pb-0.5 sm:pb-2.5 border-b border-zinc-200/80">
          <div>
            <h2 className="text-sm sm:text-2xl font-black text-zinc-900 tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="hidden sm:block text-xs sm:text-sm text-zinc-500 font-normal mt-0.5">{subtitle}</p>
            )}
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-zinc-700 hover:text-emerald-800 transition group cursor-pointer"
            >
              <span>সবগুলো দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* 4 Cards Grid (With gap-3 on mobile for distinct card separation) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {products.map((product) => (
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

      </div>
    </section>
  );
};
