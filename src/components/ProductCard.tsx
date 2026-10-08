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
      className="group cursor-pointer flex flex-col justify-between bg-white rounded-xl sm:rounded-3xl p-1 sm:p-3.5 border border-zinc-200/80 hover:border-emerald-700/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 h-full active:scale-[0.99] min-w-0 overflow-hidden"
    >
      {/* 1. Compact Uniform Image Container (Consistent 1:1 Aspect Ratio on All Screens) */}
      <div className="relative aspect-square w-full bg-zinc-100 rounded-lg sm:rounded-2xl overflow-hidden mb-1 sm:mb-2 border border-stone-200/70 shadow-2xs flex items-center justify-center">
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
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 z-10">
          {product.badge && (
            <span className="bg-[#13231B]/90 backdrop-blur-2xs text-amber-300 text-[7px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
              {product.badge}
            </span>
          )}
          {discountAmount > 0 && (
            <span className="bg-rose-600/90 backdrop-blur-2xs text-white text-[7px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
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

        {/* Wishlist Heart Icon (With Press Effect) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition cursor-pointer shadow-xs active:scale-90 active:brightness-90 ${
            isWishlisted
              ? 'text-rose-600 bg-white'
              : 'text-zinc-600 hover:text-rose-600 bg-white/95 hover:bg-white'
          }`}
          title="পছন্দের তালিকায় রাখুন"
        >
          <Heart className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Floating Quick Add-To-Cart Button (With Press Effect) */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-5.5 h-5.5 sm:w-9 sm:h-9 rounded-md sm:rounded-xl flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
            added
              ? 'bg-emerald-600 text-white scale-105'
              : 'bg-[#13231B] hover:bg-[#1f372a] text-white hover:scale-105 active:scale-90 active:brightness-90'
          }`}
          title="কার্টে যোগ করুন"
        >
          {added ? <Check className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-amber-300" />}
        </button>
      </div>

      {/* 2. Product Information (Strictly 1-Line Title, 1-Line Stock & Ultra Dense) */}
      <div className="space-y-0.5 sm:space-y-1.5 flex-1 flex flex-col justify-between min-w-0 w-full overflow-hidden px-0.5">
        
        {/* Rating & Stock Status (Combined in 1 Single Line) */}
        <div className="flex items-center justify-between gap-1 min-w-0 w-full overflow-hidden">
          {/* Star Rating */}
          <div className="flex items-center gap-0.5 text-amber-500 text-[8px] sm:text-xs font-bold shrink-0 whitespace-nowrap">
            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-zinc-900">{product.rating}</span>
            <span className="text-zinc-400 font-normal text-[7px] sm:text-[10px]">({product.reviewsCount})</span>
          </div>

          {/* Stock Status Badge */}
          <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded shrink-0 whitespace-nowrap">
            <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-600 shrink-0" />
            <span>স্টকে আছে</span>
          </span>
        </div>

        {/* Product Title (Forced 1-Line with strict inline style + CSS ellipsis) */}
        <h3 
          className="font-bold text-zinc-900 text-[10px] sm:text-sm leading-tight truncate block w-full min-w-0 group-hover:text-emerald-800 transition-colors py-0.2" 
          title={product.name}
          style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {product.name}
        </h3>

        {/* Price & Discount (Compact font on mobile) */}
        <div className="flex items-baseline gap-1 pt-0.5 border-t border-zinc-100 min-w-0">
          <span className="text-[10.5px] sm:text-base font-black text-zinc-900 shrink-0">
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[8px] sm:text-xs text-zinc-400 line-through font-normal shrink-0">
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        {/* Compact Order Button (Reduced Height & Sleek Layout) */}
        <div className="pt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="w-full text-center text-[8.5px] sm:text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 h-[22px] sm:h-[34px] py-0 px-1 sm:px-4 rounded sm:rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer active:scale-95 active:brightness-90 group/btn"
          >
            <Zap className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300 group-hover/btn:scale-110 transition-transform" />
            <span>অর্ডার করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
