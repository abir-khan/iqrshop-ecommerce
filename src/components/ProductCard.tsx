import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check, Zap, CheckCircle2 } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group cursor-pointer flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 border border-zinc-200/90 hover:border-emerald-700/50 shadow-xs hover:shadow-md transition-all duration-300 h-full active:scale-[0.99] min-w-0 overflow-hidden"
    >
      {/* 1. Clean 1:1 Image Container */}
      <div className="relative aspect-square w-full bg-zinc-100 rounded-xl sm:rounded-2xl overflow-hidden mb-1.5 sm:mb-2.5 border border-stone-200/70 shadow-2xs flex items-center justify-center">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
        )}
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${product.images && product.images.length > 0 ? 'group-hover:opacity-0 sm:group-hover:opacity-0' : ''}`}
        />

        {/* Secondary Image on Hover (if available) */}
        {product.images && product.images.length > 0 && product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105"
          />
        )}

        {/* Top Badges (Sleek, Clean & Minimal Non-Intrusive Pills) */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-[#13231B]/90 backdrop-blur-2xs text-amber-300 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
              {product.badge}
            </span>
          )}
          {discountAmount > 0 && (
            <span className="bg-rose-600/90 backdrop-blur-2xs text-white text-[8px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
              ৳{discountAmount} ছাড়
            </span>
          )}
        </div>

        {/* Multi-Image Indicator Badge */}
        {product.images && product.images.length > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
            <span>📷 {product.images.length + 1}টি ছবি</span>
          </span>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-1.5 right-1.5 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition cursor-pointer shadow-xs active:scale-90 ${
            isWishlisted
              ? 'text-rose-600 bg-white'
              : 'text-zinc-600 hover:text-rose-600 bg-white/95 hover:bg-white'
          }`}
          title="পছন্দের তালিকায় রাখুন"
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* 2. Product Information & Actions (Spacious, Clear & Readable) */}
      <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between min-w-0 w-full overflow-hidden">
        
        <div className="space-y-1 min-w-0">
          {/* Rating & Stock Status */}
          <div className="flex items-center justify-between gap-1 min-w-0 w-full">
            {/* Star Rating */}
            <div className="flex items-center gap-0.5 text-amber-500 text-[9.5px] sm:text-xs font-bold shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-zinc-900">{product.rating}</span>
              <span className="text-zinc-400 font-normal text-[8.5px] sm:text-[10px]">({product.reviewsCount})</span>
            </div>

            {/* Stock Status Badge */}
            <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 sm:px-1.5 sm:py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-600 shrink-0" />
              <span>স্টকে আছে</span>
            </span>
          </div>

          {/* Product Title (2-Line Clamp with exact 13.5px font-size and 1.4 line-height) */}
          <h3 
            className="font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors" 
            style={{
              fontSize: '13.5px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '38px',
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-1.5 border-t border-zinc-100/90 space-y-1.5 min-w-0">
          {/* Price & Discount Tag with enhanced gap */}
          <div className="flex items-baseline gap-2.5 sm:gap-3 min-w-0">
            <span className="text-xs sm:text-base font-black text-stone-950 shrink-0">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-normal shrink-0">
                ৳{product.originalPrice}
              </span>
            )}
            {discountAmount > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.2 rounded-full shrink-0">
                -৳{discountAmount}
              </span>
            )}
          </div>

          {/* Dual Action Buttons Row: Prominent "অর্ডার করুন" + Dedicated Visible Cart Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Primary Order Now Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
              }}
              className="flex-1 h-7.5 sm:h-9 bg-[#13231B] hover:bg-[#1f372a] text-white rounded-lg sm:rounded-xl font-bold text-[10.5px] sm:text-xs flex items-center justify-center gap-1 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer group/btn"
              title="সরাসরি অর্ডার করুন"
            >
              <Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300 group-hover/btn:scale-110 transition-transform" />
              <span>অর্ডার করুন</span>
            </button>

            {/* Prominent Cart Button (Dedicated & Easy to Tap) */}
            <button
              onClick={handleAddToCart}
              className={`h-7.5 w-7.5 sm:h-9 sm:w-9 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 shadow-2xs ${
                added
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#13231B] border border-emerald-200/90'
              }`}
              title="কার্টে যোগ করুন"
              aria-label="কার্টে যোগ করুন"
            >
              {added ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
