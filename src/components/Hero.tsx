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
      
      {/* 1. PREMIUM ISLAMIC HERO BANNER */}
      <div 
        className="relative w-full rounded-[24px] overflow-hidden bg-[#0d2b1e] text-white p-6 sm:p-7 lg:p-11 xl:p-12 border border-[#184230] shadow-2xl group transition-all duration-300"
      >
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#F5B800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Two-column layout using flexbox (Desktop: Left 58%, Right 42% | Mobile: Stacked single column) */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          
          {/* Left Side: 55-60% width on Desktop */}
          <div className="w-full lg:w-[58%] text-left space-y-3 sm:space-y-4">
            
            {/* Small gold/yellow badge at top */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B800]/15 border border-[#F5B800]/35 text-[#F5B800] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B800] shrink-0" />
              <span>{heroData.badgeText || '১০০% খাঁটি ও হালাল কালেকশন'}</span>
            </div>

            {/* Main heading */}
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

            {/* Subtitle */}
            <p 
              className="text-xs sm:text-sm lg:text-base text-zinc-200/90 font-normal max-w-xl"
              style={{ lineHeight: 1.45 }}
            >
              {heroData.description || 'আতর, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে।'}
            </p>

            {/* Primary CTA Button + Trust Text */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
              <button 
                onClick={() => onSelectCategory('all')}
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

          {/* Right Side (Desktop min 1024px): Kaaba photo, no text overlay */}
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
