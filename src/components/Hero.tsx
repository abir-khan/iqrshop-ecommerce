import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface HeroProps {
  onSelectCategory: (categoryId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory }) => {
  const { data } = useCms();
  const { heroData } = data;

  return (
    <section className="py-0 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1.5 sm:space-y-6">
      
      {/* 1. COMPACT HERO BANNER (BOUNDED & FOCUSED) */}
      <div 
        className="relative max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1f16] via-[#122e22] to-[#183a2b] text-white p-4 sm:p-8 lg:p-10 border border-[#234d37] shadow-xl group transition-all duration-300"
      >
        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container (Left-aligned, clean, elegant) */}
        <div className="relative space-y-2 sm:space-y-3.5 max-w-2xl text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-xs sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{heroData.badgeText || '১০০% খাঁটি ও হালাল কালেকশন'}</span>
          </div>

          <h1 
            className="text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight"
            style={{ fontWeight: 700, lineHeight: 1.28, letterSpacing: '-0.35px' }}
          >
            {heroData.titlePrefix || 'সুন্নতি লাইফস্টাইল ও'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              {heroData.titleHighlight || 'প্রিমিয়াম কালেকশন'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 leading-snug sm:leading-relaxed font-normal max-w-xl">
            {heroData.description || 'আতর, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে।'}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 sm:gap-5">
            <button 
              onClick={() => onSelectCategory('all')}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-sm sm:text-base font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 group/cta ring-2 ring-amber-300/40"
            >
              <span>কালেকশন দেখুন</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/cta:translate-x-1 transition-transform shrink-0" />
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span>{heroData.trustBadgeText || 'পণ্য দেখে মূল্য পরিশোধ'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMPACT CATEGORY CARDS (3-COL ON MOBILE) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-5">
        {heroData.featureCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectCategory(card.categoryId)}
            className="bg-[#F8F9F8] hover:bg-white p-2 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 hover:border-emerald-700/40 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left group"
          >
            <div className="w-12 h-12 sm:w-22 sm:h-22 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-zinc-200 shrink-0 group-hover:scale-105 transition-transform mb-1.5 sm:mb-0 sm:order-last">
              <img
                src={card.image}
                alt={card.imageAlt || card.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-0.5 sm:space-y-1.5 w-full sm:max-w-[65%]">
              <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                {card.badge}
              </span>
              <h3 className="text-xs sm:text-lg font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors truncate">
                {card.title}
              </h3>
              <p className="hidden sm:block text-xs text-zinc-500 line-clamp-1">
                {card.subtitle}
              </p>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded-md inline-flex items-center justify-center gap-0.5 mt-0.5 sm:pt-1">
                <span>{card.buttonText || 'অর্ডার'}</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
