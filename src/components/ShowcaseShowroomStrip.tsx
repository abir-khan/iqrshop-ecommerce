import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface ShowcaseShowroomStripProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ShowcaseShowroomStrip: React.FC<ShowcaseShowroomStripProps> = ({ onSelectCategory }) => {
  const { data } = useCms();
  const strip = data.showroomStrip || {
    title: 'এক্সক্লুসিভ শোরুম ও স্পেশাল গিফট কালেকশন',
    badge: 'GIFT SPECIAL',
    subtitle: 'প্রিয়জনকে উপহার দিতে প্রিমিয়াম বক্স প্যাকেজিং ও সারাদেশে দ্রুত হোম ডেলিভারি',
    buttonText: 'গিফট প্যাকেজ দেখুন',
    categoryId: 'gift',
    enabled: true,
  };

  if (!strip.enabled) return null;

  return (
    <section className="py-2 sm:py-3 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div 
        onClick={() => onSelectCategory(strip.categoryId || 'gift')}
        className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-3 sm:p-5 border border-emerald-700/40 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6"
      >
        {/* Left Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs sm:text-base font-black text-white tracking-tight">
                {strip.title}
              </span>
              {strip.badge && (
                <span className="hidden md:inline-block bg-amber-400 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {strip.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200 mt-0.5 font-normal">
              {strip.subtitle}
            </p>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-300 group-hover:text-amber-200 transition">
            <span>{strip.buttonText || 'গিফট প্যাকেজ দেখুন'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </section>
  );
};

