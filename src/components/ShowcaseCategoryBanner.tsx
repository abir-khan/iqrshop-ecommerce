import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CategoryBannerConfig {
  id: string;
  categoryId: string;
  englishTitle: string;
  banglaTitle: string;
  tagline: string;
  badge: string;
  image: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  buttonText: string;
  enabled?: boolean;
}

interface ShowcaseCategoryBannerProps {
  config: CategoryBannerConfig;
  onSelectCategory: (categoryId: string) => void;
  totalProducts?: number;
}

export const ShowcaseCategoryBanner: React.FC<ShowcaseCategoryBannerProps> = ({
  config,
  onSelectCategory,
  totalProducts,
}) => {
  return (
    <div
      onClick={() => onSelectCategory(config.categoryId)}
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300 border border-black/5 ${config.bgGradient}`}
    >
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Main Container Layout */}
      <div className="relative z-10 flex items-center justify-between min-h-[120px] sm:min-h-[170px] lg:min-h-[200px] px-4 sm:px-8 lg:px-12 py-3 sm:py-6 gap-3 sm:gap-6">
        
        {/* Left Typography & Content */}
        <div className="max-w-[62%] sm:max-w-[60%] lg:max-w-[55%] space-y-1 sm:space-y-2.5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs"
            style={{ backgroundColor: config.badgeBg, color: config.textColor }}
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>{config.badge}</span>
          </div>

          {/* Big English & Bengali Title like in Believer reference */}
          <div>
            <h2 className="text-lg sm:text-3xl lg:text-5xl font-black tracking-tight uppercase leading-none font-sans"
              style={{ color: config.textColor }}
            >
              {config.englishTitle}
            </h2>
            <p className="text-[11px] sm:text-sm lg:text-base font-bold text-zinc-700 mt-0.5 sm:mt-1">
              {config.banglaTitle}
            </p>
          </div>

          {/* Tagline */}
          <p className="hidden sm:block text-xs sm:text-sm text-zinc-600 font-medium line-clamp-1">
            {config.tagline}
          </p>

          {/* Action Link */}
          <div className="pt-0.5 sm:pt-2">
            <span
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold transition group-hover:underline"
              style={{ color: config.accentColor }}
            >
              <span>{config.buttonText || 'কালেকশন দেখুন'}</span>
              {totalProducts && totalProducts > 0 && (
                <span className="hidden md:inline text-[11px] opacity-75">({totalProducts}+ টি)</span>
              )}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Right Product Showcase Hero Visual */}
        <div className="relative w-[38%] sm:w-[40%] lg:w-[45%] h-full flex items-center justify-end">
          <div className="relative w-full max-w-[200px] sm:max-w-[320px] lg:max-w-[420px] h-[100px] sm:h-[150px] lg:h-[180px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-white/60">
            <img
              src={config.image}
              alt={config.englishTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/10 sm:to-black/5" />
          </div>
        </div>

      </div>
    </div>
  );
};
