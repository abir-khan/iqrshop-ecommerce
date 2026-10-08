import React, { useState } from 'react';
import { X, Copy, Check, ChevronRight, ChevronLeft, ArrowRight, Gift, Sparkles } from 'lucide-react';

import type { Product } from '../types';

interface SidePromotionBannersProps {
  onSelectCategory?: (categoryId: string) => void;
  onBuyProduct?: (product: Product, size?: string) => void;
}

export const SidePromotionBanners: React.FC<SidePromotionBannersProps> = ({
  onSelectCategory,
}) => {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const [leftCopied, setLeftCopied] = useState(false);
  const [rightCopied, setRightCopied] = useState(false);

  const leftCoupon = 'IQR05';
  const rightCoupon = 'UMRAH10';

  const copyLeftCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(leftCoupon);
    setLeftCopied(true);
    setTimeout(() => setLeftCopied(false), 2000);
  };

  const copyRightCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rightCoupon);
    setRightCopied(true);
    setTimeout(() => setRightCopied(false), 2000);
  };

  const handleLeftAction = () => {
    if (onSelectCategory) {
      onSelectCategory('deals');
    }
    const target = document.getElementById('featured') || document.getElementById('deals');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRightAction = () => {
    if (onSelectCategory) {
      onSelectCategory('janamaz');
    }
    const target = document.getElementById('deals') || document.getElementById('featured');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LEFT PROMO BANNER: FESTIVAL CRIMSON RED (লাল উৎসব ব্যানার)            */}
      {/* ========================================================================= */}
      <aside
        aria-label="বাম পাশের মেগা অফার ব্যানার"
        className="fixed left-2 xl:left-3 2xl:left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-300"
      >
        {isLeftOpen ? (
          <div className="relative w-[230px] 2xl:w-[250px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#A50E0E] via-[#BD1515] to-[#7A0606] text-white shadow-2xl border-2 border-amber-400/90 p-3 pt-2 text-center transition-all duration-300 group">
            
            {/* Top Close Button */}
            <button
              onClick={() => setIsLeftOpen(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition z-30 cursor-pointer shadow-md"
              title="মিনিমাইজ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Festive Hanging Bunting Garland (পতাকা তোরণ) */}
            <div className="absolute top-0 left-0 right-0 h-4 flex justify-around overflow-hidden pointer-events-none opacity-90 px-2">
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-300 transform -rotate-6" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-white" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-emerald-300 transform rotate-6" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-amber-300" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-rose-300 transform -rotate-6" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-sky-300" />
            </div>

            {/* Top Ornamental White Crest */}
            <div className="mt-2.5 mb-2 flex justify-center">
              <div className="relative bg-white text-stone-900 px-4 py-1.5 rounded-2xl border-2 border-amber-500 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-red-700 font-extrabold text-[10px] tracking-wide">
                    ইকর শপ
                  </span>
                </div>
                <div className="font-black text-xs sm:text-sm text-red-600 tracking-tight leading-none uppercase">
                  ইসলামী মেগা মেলা
                </div>
                <div className="text-[9px] font-bold text-slate-700 leading-none mt-0.5">
                  ২০২৬
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-500 transform rotate-45" />
              </div>
            </div>

            {/* Category Tagline */}
            <div className="text-[11px] font-bold text-amber-200 mt-2 mb-1.5">
              ইসলামী কালেকশনে
            </div>

            {/* HUGE 3D PRIMARY DISCOUNT BOX: ৭০% পর্যন্ত ছাড়! */}
            <div className="relative bg-gradient-to-b from-[#ff3c17] via-[#eb2000] to-[#c71600] rounded-2xl p-2.5 border-2 border-white/95 shadow-xl mb-2 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl 2xl:text-4xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-tighter">
                  ৭০%
                </span>
                <div className="text-left leading-none pl-0.5">
                  <span className="text-[10px] font-black text-amber-200 block">
                    পর্যন্ত
                  </span>
                  <span className="text-2xl 2xl:text-3xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] leading-none">
                    ছাড়!
                  </span>
                </div>
              </div>
            </div>

            {/* SECONDARY OFFER HOOK */}
            <div className="text-[10px] font-black text-amber-100 mb-1">
              ৫৯৯৳ যেকোনো পণ্য অর্ডারে
            </div>

            <div className="relative bg-gradient-to-b from-[#ff401c] to-[#c71600] rounded-xl p-1.5 border border-white/80 shadow-md mb-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl 2xl:text-3xl font-black text-white drop-shadow leading-none">
                  ৮%
                </span>
                <div className="text-left leading-none">
                  <span className="text-[9px] font-bold text-amber-200 block">
                    অতিরিক্ত
                  </span>
                  <span className="text-lg font-black text-white drop-shadow leading-none">
                    ছাড়!
                  </span>
                </div>
              </div>
            </div>

            {/* WHITE PROMOCODE COUPON TICKET */}
            <div
              onClick={copyLeftCoupon}
              className="relative bg-white text-stone-900 rounded-lg p-1.5 border-2 border-dashed border-red-500 shadow-sm mb-2 cursor-pointer hover:bg-amber-50 transition group/coupon"
              title="ক্লিক করে কোড কপি করুন"
            >
              <div className="font-mono font-black text-xs text-red-600 tracking-wider">
                '{leftCoupon}'
              </div>
              <div className="text-[8px] font-bold text-stone-600 flex items-center justify-center gap-1">
                {leftCopied ? (
                  <span className="text-emerald-700 font-black flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> কোড কপি হয়েছে!
                  </span>
                ) : (
                  <>
                    <span>প্রমোকোড ব্যবহারে</span>
                    <Copy className="w-2.5 h-2.5 text-red-500 group-hover/coupon:scale-110 transition-transform" />
                  </>
                )}
              </div>
            </div>

            {/* Bottom Trust Line */}
            <div className="bg-black/30 rounded-lg py-1 px-1 text-[8.5px] font-semibold text-stone-200 mb-2 leading-tight">
              প্রয়োজনীয় যেকোনো পণ্য নিশ্চিন্তে অর্ডার করুন{' '}
              <span className="text-amber-300 font-bold">ক্যাশ অন ডেলিভারিতে</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleLeftAction}
              className="w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 text-red-950 font-black text-xs py-2 rounded-xl shadow-lg transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <span>অফারটি লুফে নিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        ) : (
          /* Minimized Festive Red Tab */
          <button
            onClick={() => setIsLeftOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-b from-[#A50E0E] to-[#7A0606] text-amber-200 border-2 border-amber-400 py-3 px-2 rounded-r-2xl shadow-2xl hover:scale-105 transition cursor-pointer text-xs font-black group"
            title="মেগা মেলা অফার দেখুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="[writing-mode:vertical-lr] rotate-180 tracking-wide text-[11px] font-black uppercase text-white">
              🎉 মেগা মেলা ৭০% ছাড়!
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. RIGHT PROMO BANNER: ROYAL ISLAMIC EMERALD (সবুজ ও গোল্ডেন ইবাদত ব্যানার) */}
      {/* ========================================================================= */}
      <aside
        aria-label="ডান পাশের উমরাহ ও ইবাদত অফার ব্যানার"
        className="fixed right-2 xl:right-3 2xl:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-300"
      >
        {isRightOpen ? (
          <div className="relative w-[230px] 2xl:w-[250px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B4634] via-[#0E5841] to-[#06291E] text-white shadow-2xl border-2 border-amber-400/90 p-3 pt-2 text-center transition-all duration-300 group">
            
            {/* Top Close Button */}
            <button
              onClick={() => setIsRightOpen(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition z-30 cursor-pointer shadow-md"
              title="মিনিমাইজ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Festive Hanging Bunting Garland (গোল্ড ও এমারেল্ড তোরণ) */}
            <div className="absolute top-0 left-0 right-0 h-4 flex justify-around overflow-hidden pointer-events-none opacity-90 px-2">
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-amber-300" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-white transform rotate-6" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-300" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-emerald-200 transform -rotate-6" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-amber-300" />
              <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-white" />
            </div>

            {/* Top Ornamental White Crest */}
            <div className="mt-2.5 mb-2 flex justify-center">
              <div className="relative bg-white text-stone-900 px-4 py-1.5 rounded-2xl border-2 border-amber-500 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#0B4634] font-extrabold text-[10px] tracking-wide">
                    ইকর শপ
                  </span>
                </div>
                <div className="font-black text-xs sm:text-sm text-[#0B4634] tracking-tight leading-none uppercase">
                  উমরাহ ও ইবাদত প্যাক
                </div>
                <div className="text-[9px] font-bold text-amber-700 leading-none mt-0.5">
                  স্পেশাল গিফট ডিল
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-500 transform rotate-45" />
              </div>
            </div>

            {/* Category Tagline */}
            <div className="text-[11px] font-bold text-amber-200 mt-2 mb-1.5">
              জায়নামাজ, আতর ও তসবিহ
            </div>

            {/* HUGE 3D PRIMARY DISCOUNT BOX: ৫০% সুপার ছাড়! */}
            <div className="relative bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#8c3e06] rounded-2xl p-2.5 border-2 border-white/95 shadow-xl mb-2 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl 2xl:text-4xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-tighter">
                  ৫০%
                </span>
                <div className="text-left leading-none pl-0.5">
                  <span className="text-[10px] font-black text-yellow-200 block">
                    সুপার
                  </span>
                  <span className="text-2xl 2xl:text-3xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] leading-none">
                    ছাড়!
                  </span>
                </div>
              </div>
            </div>

            {/* SECONDARY OFFER HOOK */}
            <div className="text-[10px] font-black text-amber-100 mb-1">
              যেকোনো প্যাকেজ অর্ডারে
            </div>

            <div className="relative bg-gradient-to-b from-[#0e6d4f] to-[#094734] rounded-xl p-1.5 border border-white/80 shadow-md mb-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg 2xl:text-xl font-black text-yellow-300 drop-shadow leading-none">
                  🎁 ফ্রি তসবিহ
                </span>
                <span className="text-sm font-black text-white drop-shadow leading-none">
                  উপহার!
                </span>
              </div>
            </div>

            {/* WHITE PROMOCODE COUPON TICKET */}
            <div
              onClick={copyRightCoupon}
              className="relative bg-white text-stone-900 rounded-lg p-1.5 border-2 border-dashed border-[#0B4634] shadow-sm mb-2 cursor-pointer hover:bg-amber-50 transition group/coupon"
              title="ক্লিক করে কোড কপি করুন"
            >
              <div className="font-mono font-black text-xs text-[#0B4634] tracking-wider">
                '{rightCoupon}'
              </div>
              <div className="text-[8px] font-bold text-stone-600 flex items-center justify-center gap-1">
                {rightCopied ? (
                  <span className="text-emerald-700 font-black flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> কোড কপি হয়েছে!
                  </span>
                ) : (
                  <>
                    <span>প্যাকেজ কুপন কোড</span>
                    <Copy className="w-2.5 h-2.5 text-[#0B4634] group-hover/coupon:scale-110 transition-transform" />
                  </>
                )}
              </div>
            </div>

            {/* Bottom Trust Line */}
            <div className="bg-black/30 rounded-lg py-1 px-1 text-[8.5px] font-semibold text-stone-200 mb-2 leading-tight">
              সারা দেশে প্রিমিয়াম প্যাকেজিং ও{' '}
              <span className="text-amber-300 font-bold">ফ্রি হোম ডেলিভারি</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRightAction}
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-[#0B4634] font-black text-xs py-2 rounded-xl shadow-lg transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>প্যাকেজ বুক করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        ) : (
          /* Minimized Emerald Tab */
          <button
            onClick={() => setIsRightOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-b from-[#0B4634] to-[#06291E] text-amber-200 border-2 border-amber-400 py-3 px-2 rounded-l-2xl shadow-2xl hover:scale-105 transition cursor-pointer text-xs font-black group"
            title="উমরাহ প্যাক অফার দেখুন"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-amber-300" />
            <span className="[writing-mode:vertical-lr] tracking-wide text-[11px] font-black uppercase text-white">
              🕌 উমরাহ প্যাক ৫০% ছাড়!
            </span>
            <Gift className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          </button>
        )}
      </aside>
    </>
  );
};
