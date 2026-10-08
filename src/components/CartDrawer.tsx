import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 2000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);
  const deliveryProgress = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#EFE8DC]">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-[#EFE8DC] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0D382D] text-amber-300 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-stone-900 text-base">আপনার শপিং ব্যাগ</h2>
                <span className="text-[11px] text-stone-500 font-medium">
                  {cartCount} টি পণ্য নির্বাচিত
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-emerald-50/80 px-4 py-2.5 border-b border-emerald-100 text-xs text-emerald-900">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 font-bold">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  {remainingForFreeDelivery === 0
                    ? '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!'
                    : `আর ৳${remainingForFreeDelivery} টাকার অর্ডারে ফ্রি ডেলিভারি!`}
                </span>
                <span className="font-bold text-[10px] text-emerald-700">
                  {Math.round(deliveryProgress)}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-20 h-20 rounded-full bg-[#FAF8F5] flex items-center justify-center text-4xl border border-[#E8DFD1]">
                  🛍️
                </div>
                <h3 className="font-black text-stone-800 text-lg">আপনার ব্যাগ খালি!</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  পছন্দের আতর, জায়নামাজ বা অর্গানিক খাবার বেছে নিন এবং ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 bg-[#0D382D] text-white text-xs font-bold py-3 px-6 rounded-full hover:bg-[#124B3D] transition shadow-md cursor-pointer"
                >
                  পণ্য ব্রাউজ করুন
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || ''}`}
                  className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DC]"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-stone-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight line-clamp-1">
                      {item.product.name}
                    </h4>
                    {item.selectedSize && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        সাইজ: {item.selectedSize}
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-black text-[#0D382D] mt-1">
                      ৳{item.product.price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-white border border-[#E8DFD1] rounded-xl p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                      }
                      className="p-1 text-stone-500 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-stone-800 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                      }
                      className="p-1 text-stone-500 hover:text-[#0D382D] transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EFE8DC] bg-[#FAF8F5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-stone-600">মোট পণ্যের মূল্য:</span>
                <span className="text-2xl font-black text-[#0D382D]">৳{cartTotal}</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-stone-500 font-medium pb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ক্যাশ অন ডেলিভারি • পণ্য দেখে মূল্য পরিশোধ</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
