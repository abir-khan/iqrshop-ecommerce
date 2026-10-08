import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, size?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  // Deduplicated list of all gallery images
  const allImages = Array.from(
    new Set([product.image, ...(product.images || [])].filter((url): url is string => !!url && url.trim().length > 0))
  );

  const activeImage = allImages[activeImageIndex] || product.image;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 relative cursor-default my-auto"
      >
        
        {/* Sleek Non-Overlapping Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 border border-zinc-200/80"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Product Multi-Image Gallery */}
          <div className="flex flex-col bg-zinc-50 border-r border-zinc-100 p-3 sm:p-4 space-y-2.5">
            {/* Main Active Image with Arrows */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex items-center justify-center group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {product.badge && (
                <span className="absolute top-2.5 left-2.5 bg-[#13231B] text-amber-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Navigation Arrows for Multi-image */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                    title="আগের ছবি"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                    title="পরের ছবি"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Image Counter Badge */}
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeImageIndex + 1} / {allImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Clickable Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-emerald-700 shadow-xs scale-105'
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              
              {/* Rating & Stock (with pr-9 to prevent collision with close button) */}
              <div className="flex items-center justify-between pr-9">
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-zinc-400 font-normal">({product.reviewsCount} রিভিউ)</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>স্টকে আছে</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-900">
                  ৳{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-zinc-400 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-md">
                    -{discountPercent}% ছাড়
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Sizes (if available) */}
              {product.sizes && (
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-bold text-zinc-800">সাইজ নির্বাচন করুন:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#13231B] text-white border-[#13231B]'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Actions & Prominent Trust Badges */}
            <div className="space-y-3 pt-3 border-t border-zinc-100">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAdd}
                  className="py-2.5 px-3 rounded-xl text-xs sm:text-[13px] font-semibold border-2 border-[#13231B] text-[#13231B] hover:bg-zinc-50 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'যুক্ত হয়েছে!' : 'ব্যাগে যোগ'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(product, selectedSize);
                  }}
                  className="py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>অর্ডার করুন</span>
                </button>
              </div>

              {/* Prominent Trust Badges under Actions */}
              <div className="bg-[#FAFAF9] rounded-2xl p-2.5 border border-zinc-200/80 space-y-1.5 text-[11px] text-zinc-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span><strong>ক্যাশ অন ডেলিভারি:</strong> পার্সেল দেখে মূল্য পরিশোধ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span><strong>৭ দিনের রিটার্ন পলিসি:</strong> শতভাগ নিরাপদ শপিং</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span><strong>দ্রুত ডেলিভারি:</strong> সারাদেশে ২-৩ কার্যদিবসের মধ্যে</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
