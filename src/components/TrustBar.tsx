import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const TrustBar: React.FC = () => {
  const { data } = useCms();
  const { trustItems } = data;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5 text-[#13231B]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-[#13231B]" />;
      case 'refresh':
        return <RefreshCw className="w-5 h-5 text-[#13231B]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'heart':
      default:
        return <Heart className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <section className="py-1 sm:py-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FAFAF9] rounded-2xl sm:rounded-3xl p-2 sm:p-6 border border-zinc-200/80 shadow-2xs">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-6">
          {trustItems.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3.5 p-1 sm:p-0 rounded-xl sm:rounded-none ${
                index === 4 ? 'hidden sm:flex' : 'flex'
              }`}
            >
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shrink-0 border border-zinc-200/80 shadow-2xs">
                {getIcon(item.iconName)}
              </div>
              <div className="space-y-0 min-w-0">
                <h4 className="text-[10px] sm:text-sm font-bold text-zinc-900 leading-tight truncate sm:whitespace-normal">
                  {item.title}
                </h4>
                <p className="hidden sm:block text-xs text-zinc-500 font-normal leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
