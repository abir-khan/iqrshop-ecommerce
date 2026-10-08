import React from 'react';
import { X, Heart, ShoppingBag, Trash2, Zap } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onBuyNow: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onBuyNow,
}) => {
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFD1] relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EFE8DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-black text-stone-900 text-base sm:text-lg">
              পছন্দের তালিকা (Wishlist)
            </h3>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                🤍
              </div>
              <h4 className="font-bold text-stone-800 text-sm">তালিকায় কোনো পণ্য নেই</h4>
              <p className="text-xs text-stone-400">
                পণ্যের উপরে থাকা হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় যুক্ত করতে পারেন।
              </p>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DC]"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{p.name}</h4>
                  <div className="text-sm font-black text-[#0D382D] mt-0.5">৳{p.price}</div>
                  {p.originalPrice && (
                    <span className="text-[10px] text-stone-400 line-through">
                      ৳{p.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      addToCart(p);
                    }}
                    className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
                    title="ব্যাগে যোগ করুন"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onBuyNow(p);
                    }}
                    className="p-2 rounded-xl bg-[#0D382D] text-white hover:bg-[#124B3D] transition cursor-pointer"
                    title="এখনই অর্ডার করুন"
                  >
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
