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
      {/* Full-width rounded card (border-radius: 24px) */}
      <div 
        className="relative w-full rounded-[24px] overflow-hidden bg-[#0d2b1e] text-white p-6 sm:p-7 lg:p-11 xl:p-12 border border-[#184230] shadow-2xl group transition-all duration-300"
      >
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Subtle luxury ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F5B800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Two-column layout using flexbox (Desktop: Left 58%, Right 42% | Mobile: Stacked single column) */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          
          {/* Left Side: 55-60% width on Desktop */}
          <div className="w-full lg:w-[58%] text-left space-y-3 sm:space-y-4">
            
            {/* Small gold/yellow badge at top */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B800]/15 border border-[#F5B800]/35 text-[#F5B800] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B800] shrink-0" />
              <span>{heroData.badgeText || '১০০% খাঁটি ও হালাল কালেকশন'}</span>
            </div>

            {/* Main heading: font-weight 700 (not 900), line-height 1.35-1.45, no negative letter-spacing */}
            <h1 
              className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] text-white tracking-normal"
              style={{ 
                fontWeight: 700, 
                lineHeight: 1.38, 
                letterSpacing: '0px',
                fontFeatureSettings: '"liga" 1, "calt" 1'
              }}
            >
              {heroData.titlePrefix || 'সুন্নতি লাইফস্টাইল ও'}{' '}
              <span className="text-[#F5B800]">
                {heroData.titleHighlight || 'প্রিমিয়াম কালেকশন'}
              </span>
            </h1>

            {/* Short subtitle in light gray/white */}
            <p 
              className="text-xs sm:text-sm lg:text-base text-zinc-200/90 font-normal max-w-xl"
              style={{ lineHeight: 1.45 }}
            >
              {heroData.description || 'আতর, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে।'}
            </p>

            {/* CTA Button + Trust Text: Full-width button on mobile, auto on desktop */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory('all');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#F5B800] hover:bg-[#e0a800] text-stone-950 text-sm sm:text-base font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 group/cta"
              >
                <span>{heroData.ctaButtonText || 'কালেকশন দেখুন'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/cta:translate-x-1 transition-transform shrink-0" />
              </button>

              <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>{heroData.trustBadgeText || 'পণ্য দেখে মূল্য পরিশোধ'}</span>
              </div>
            </div>

          </div>

          {/* Right Side (Desktop min 1024px): 40-45% width, high quality daytime Kaaba photo, no text overlay */}
          <div className="hidden lg:block lg:w-[42%] shrink-0">
            <div className="relative w-full aspect-[4/3] max-h-[350px] rounded-[16px] overflow-hidden shadow-2xl shadow-black/40 border border-white/10 group-hover:scale-[1.01] transition-transform duration-300">
              <img
                src={heroData.mainImage || '/kaaba-hero.jpg'}
                alt="পবিত্র কাবা শরীফ - মক্কা মুকাররমা"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
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

