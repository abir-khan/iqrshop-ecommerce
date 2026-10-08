import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Globe, ExternalLink } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface ShowcaseHeroBannerProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ShowcaseHeroBanner: React.FC<ShowcaseHeroBannerProps> = ({ onSelectCategory }) => {
  const { data } = useCms();
  const { heroData } = data;

  return (
    <section className="py-2 sm:py-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Main Wide Hero Banner */}
      <div 
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1f17] via-[#142e22] to-[#1d3d2f] text-white p-4 sm:p-8 lg:p-12 border border-[#234d37] shadow-lg group flex flex-row items-center justify-between gap-3 sm:gap-8 transition-all duration-300"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Left Content */}
        <div className="space-y-1.5 sm:space-y-3.5 max-w-[60%] sm:max-w-xl text-left z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-bold shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span>{heroData.badgeText || '১০০% খাঁটি ও সুন্নতি কালেকশন'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-base sm:text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase">
            {heroData.titlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              {heroData.titleHighlight}
            </span>
          </h1>

          {/* 2-Line Subtitle */}
          <p className="text-[11px] sm:text-sm lg:text-base text-zinc-300 leading-snug sm:leading-relaxed font-normal line-clamp-2">
            {heroData.description || '১০০% খাঁটি এরাবিয়ান আতর, প্রিমিয়াম পাঞ্জাবি, তুর্কি জায়নামাজ ও সুন্নতি পণ্য ক্যাশ অন ডেলিভারিতে।'}
          </p>

          {/* Buttons & Trust Bar */}
          <div className="pt-1 sm:pt-3 flex items-center gap-3 sm:gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory('all');
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>{heroData.ctaButtonText || 'কালেকশন দেখুন'}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{heroData.trustBadgeText || 'পণ্য দেখে মূল্য পরিশোধ'}</span>
            </span>
          </div>
        </div>

        {/* Right Hero Image & External Link Button */}
        <div className="relative w-[40%] sm:w-[42%] lg:w-[45%] h-full flex flex-col items-end justify-center gap-2 sm:gap-3 z-10">
          <div className="relative w-full max-w-[180px] sm:max-w-[340px] lg:max-w-[460px] aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/30 group-hover:border-amber-400/60 transition duration-500">
            <img
              src={heroData.mainImage || 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&auto=format&fit=crop&q=80'}
              alt={heroData.mainImageAlt || 'IQR Shop Collection'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {heroData.showExternalButton !== false && heroData.externalButtonUrl && (
            <a
              href={heroData.externalButtonUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[180px] sm:max-w-[340px] lg:max-w-[460px] inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 hover:from-amber-500 hover:to-amber-400 hover:text-stone-950 backdrop-blur-md border border-amber-400/40 hover:border-amber-400 text-amber-300 text-[10px] sm:text-xs lg:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer text-center group/btn"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 group-hover/btn:text-stone-950 shrink-0 group-hover/btn:rotate-12 transition-transform" />
              <span className="truncate">{heroData.externalButtonText || 'আমাদের অন্য ওয়েবসাইট'}</span>
              <ExternalLink className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 opacity-80 group-hover/btn:opacity-100 shrink-0" />
            </a>
          )}
        </div>

      </div>
    </section>
  );
};

