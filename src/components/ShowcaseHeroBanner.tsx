import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Banknote, RotateCcw, Truck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface ShowcaseHeroBannerProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ShowcaseHeroBanner: React.FC<ShowcaseHeroBannerProps> = ({ onSelectCategory }) => {
  const { data } = useCms();
  const { heroData } = data;

  return (
    <section className="py-2 sm:py-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Centered / Bounded Hero Banner Card (Compact & Focused) */}
      <div 
        className="relative max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1f16] via-[#122e22] to-[#183a2b] text-white p-4 sm:p-8 lg:p-10 border border-[#234d37] shadow-xl group transition-all duration-300"
      >
        {/* Subtle Background Pattern & Luxury Ambient Glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Content Container (Left-aligned, clean, elegant) */}
        <div className="relative space-y-2 sm:space-y-3.5 max-w-2xl text-left z-10">
          
          {/* Badge: ১০০% খাঁটি ও হালাল কালেকশন */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-xs sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{heroData.badgeText || '১০০% খাঁটি ও হালাল কালেকশন'}</span>
          </div>

          {/* Heading: সুন্নতি লাইফস্টাইল ও প্রিমিয়াম কালেকশন with font-weight: 700 */}
          <h1 
            className="text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight"
            style={{ fontWeight: 700, lineHeight: 1.28, letterSpacing: '-0.35px' }}
          >
            {heroData.titlePrefix || 'সুন্নতি লাইফস্টাইল ও'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              {heroData.titleHighlight || 'প্রিমিয়াম কালেকশন'}
            </span>
          </h1>

          {/* Subtitle: আতর, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে। */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 leading-snug sm:leading-relaxed font-normal max-w-xl">
            {heroData.description || 'আতর, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে।'}
          </p>

          {/* Prominent Yellow Button + Trust Text */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 sm:gap-5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory('all');
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-sm sm:text-base font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 group/cta ring-2 ring-amber-300/40"
            >
              <span>কালেকশন দেখুন</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/cta:translate-x-1 transition-transform shrink-0" />
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span>{heroData.trustBadgeText || 'পণ্য দেখে মূল্য পরিশোধ'}</span>
            </span>
          </div>

        </div>

      </div>

      {/* 4 Prominent Guarantee Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-5 items-stretch">
        {/* 1. ক্যাশ অন ডেলিভারি */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-2 sm:gap-3.5 min-h-[68px] sm:min-h-[78px] h-full">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-2xs">
            <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              className="text-[13.5px] sm:text-[14px] font-black text-stone-900 group-hover:text-emerald-800 transition-colors"
              style={{ lineHeight: 1.35 }}
            >
              ক্যাশ অন ডেলিভারি
            </h4>
            <p className="text-[10px] sm:text-[11.5px] text-stone-400 mt-0.5 truncate leading-tight font-medium">
              পণ্য দেখে মূল্য পরিশোধ
            </p>
          </div>
        </div>

        {/* 2. ৭ দিনের রিটার্ন */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-500/40 transition-all duration-300 flex items-center gap-2 sm:gap-3.5 min-h-[68px] sm:min-h-[78px] h-full">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300 shadow-2xs">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              className="text-[13.5px] sm:text-[14px] font-black text-stone-900 group-hover:text-amber-800 transition-colors"
              style={{ lineHeight: 1.35 }}
            >
              ৭ দিনের রিটার্ন
            </h4>
            <p className="text-[10px] sm:text-[11.5px] text-stone-400 mt-0.5 truncate leading-tight font-medium">
              সহজ এক্সচেঞ্জ পলিসি
            </p>
          </div>
        </div>

        {/* 3. অরিজিনাল প্রোডাক্ট গ্যারান্টি */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-purple-500/40 transition-all duration-300 flex items-center gap-2 sm:gap-3.5 min-h-[68px] sm:min-h-[78px] h-full">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/20 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              className="text-[13.5px] sm:text-[14px] font-black text-stone-900 group-hover:text-purple-800 transition-colors"
              style={{ lineHeight: 1.35 }}
            >
              অরিজিনাল প্রোডাক্ট গ্যারান্টি
            </h4>
            <p className="text-[10px] sm:text-[11.5px] text-stone-400 mt-0.5 truncate leading-tight font-medium">
              ১০০% খাঁটি পণ্যের নিশ্চয়তা
            </p>
          </div>
        </div>

        {/* 4. ডেলিভারি ২-৫ দিন */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/40 transition-all duration-300 flex items-center gap-2 sm:gap-3.5 min-h-[68px] sm:min-h-[78px] h-full">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-500/5 border border-teal-500/20 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-2xs">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              className="text-[13.5px] sm:text-[14px] font-black text-stone-900 group-hover:text-teal-800 transition-colors"
              style={{ lineHeight: 1.35 }}
            >
              ডেলিভারি ২-৫ দিন
            </h4>
            <p className="text-[10px] sm:text-[11.5px] text-stone-400 mt-0.5 truncate leading-tight font-medium">
              সারাদেশে নিরাপদ শিপিং
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

