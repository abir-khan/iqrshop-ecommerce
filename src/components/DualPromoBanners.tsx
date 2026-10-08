import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface DualPromoBannersProps {
  onSelectCategory: (categoryId: string) => void;
}

export const DualPromoBanners: React.FC<DualPromoBannersProps> = ({ onSelectCategory }) => {
  const { data } = useCms();
  const { dualBanners } = data;
  const { banner1, banner2 } = dualBanners;

  return (
    <section className="hidden sm:block py-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6">
        
        {/* Banner 1 */}
        <div 
          onClick={() => onSelectCategory(banner1.categoryId)}
          className="relative rounded-xl sm:rounded-3xl overflow-hidden bg-[#F7F7F5] p-2 sm:p-6 flex flex-col justify-between min-h-[68px] sm:min-h-[150px] border border-zinc-200/90 hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-5/12 overflow-hidden">
            <img
              src={banner1.image}
              alt={banner1.imageAlt || banner1.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[70%] sm:max-w-[65%] space-y-0.5 sm:space-y-1">
            {banner1.badge && (
              <span className="hidden sm:inline-block text-[10px] font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-200/70 px-2 py-0.5 rounded-full">
                {banner1.badge}
              </span>
            )}
            <h3 className="text-[11px] sm:text-lg font-bold text-zinc-900 leading-tight truncate">
              {banner1.title}
            </h3>
            <p className="hidden sm:block text-xs text-zinc-500 font-normal">
              {banner1.subtitle}
            </p>
          </div>

          <div className="relative z-10 pt-0.5 sm:pt-3">
            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-sm font-bold text-emerald-800 group-hover:text-emerald-900 transition">
              <span>{banner1.buttonText || 'অর্ডার'}</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Banner 2 */}
        <div 
          onClick={() => onSelectCategory(banner2.categoryId)}
          className="relative rounded-xl sm:rounded-3xl overflow-hidden bg-[#F7F7F5] p-2 sm:p-6 flex flex-col justify-between min-h-[68px] sm:min-h-[150px] border border-zinc-200/90 hover:border-zinc-300 transition-all cursor-pointer group"
        >
          <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-5/12 overflow-hidden">
            <img
              src={banner2.image}
              alt={banner2.imageAlt || banner2.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[70%] sm:max-w-[65%] space-y-0.5 sm:space-y-1">
            {banner2.badge && (
              <span className="hidden sm:inline-block text-[10px] font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-200/70 px-2 py-0.5 rounded-full">
                {banner2.badge}
              </span>
            )}
            <h3 className="text-[11px] sm:text-lg font-bold text-zinc-900 leading-tight truncate">
              {banner2.title}
            </h3>
            <p className="hidden sm:block text-xs text-zinc-500 font-normal">
              {banner2.subtitle}
            </p>
          </div>

          <div className="relative z-10 pt-0.5 sm:pt-3">
            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-sm font-bold text-emerald-800 group-hover:text-emerald-900 transition">
              <span>{banner2.buttonText || 'অর্ডার'}</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
