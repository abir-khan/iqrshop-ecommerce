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
      
      {/* 1. COMPACT HERO BANNER (MOBILE OPTIMIZED) */}
      <div 
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#11241A] via-[#163023] to-[#1A382A] text-white p-3.5 sm:p-8 lg:p-10 border border-[#234d37] shadow-md group flex flex-row items-center justify-between gap-3 sm:gap-8 transition-all duration-300"
      >
        {/* Left Content */}
        <div className="space-y-1.5 sm:space-y-3.5 max-w-[62%] sm:max-w-xl text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span>{heroData.badgeText}</span>
          </div>

          <h1 className="text-sm sm:text-2xl lg:text-4xl font-black text-white leading-tight tracking-tight">
            {heroData.titlePrefix} <span className="text-amber-400">{heroData.titleHighlight}</span>
          </h1>

          {/* 2-Line Concise Text */}
          <p className="text-[11px] sm:text-sm text-zinc-300 leading-snug sm:leading-relaxed font-normal line-clamp-2">
            {heroData.description}
          </p>

          <div className="pt-0.5 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs sm:text-sm font-black transition-all shadow-md group-hover:scale-105">
              <span className="hidden sm:inline">{heroData.ctaButtonText}</span>
              <span className="sm:hidden">অর্ডার করুন</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{heroData.trustBadgeText}</span>
            </div>
          </div>
        </div>

        {/* Right Product Image Spotlight (Compact on Mobile) */}
        <div className="w-[38%] sm:w-5/12 flex flex-col items-center justify-center gap-2 z-10 shrink-0">
          <div className="relative w-24 h-24 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 aspect-square rounded-xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-2xl border border-white/20 sm:border-2 sm:border-white/10 group-hover:scale-105 transition-transform duration-500">
            <img
              src={heroData.mainImage}
              alt={heroData.mainImageAlt || heroData.mainImageTitle}
              className="w-full h-full object-cover"
            />
            {heroData.mainImageTitle && (
              <div className="hidden sm:block absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
                <span className="text-xs font-bold text-amber-300">{heroData.mainImageTitle}</span>
              </div>
            )}
          </div>

          {heroData.showExternalButton !== false && heroData.externalButtonUrl && (
            <a
              href={heroData.externalButtonUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-24 sm:max-w-52 md:max-w-64 lg:max-w-72 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-amber-400/60 text-white hover:text-amber-300 text-[9px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
            >
              <span className="truncate">{heroData.externalButtonText || 'অন্য ওয়েবসাইট'}</span>
            </a>
          )}
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
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
