import React from 'react';
import { Sparkles, LayoutGrid, Check } from 'lucide-react';

export type LayoutTheme = 'showcase' | 'classic';

interface LayoutSwitcherProps {
  currentTheme: LayoutTheme;
  onToggleTheme: (theme: LayoutTheme) => void;
}

export const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  currentTheme,
  onToggleTheme,
}) => {
  return (
    <div className="fixed bottom-20 left-4 z-40 bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-white p-1.5 rounded-full shadow-2xl border border-stone-700/80 flex items-center gap-1 transition-all">
      <button
        onClick={() => onToggleTheme('showcase')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          currentTheme === 'showcase'
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-sm'
            : 'text-stone-300 hover:text-white'
        }`}
        title="নতুন শোরুম শোকেস ডিজাইন"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>শোরুম ডিজাইন</span>
        {currentTheme === 'showcase' && <Check className="w-3 h-3 text-stone-950 ml-0.5" />}
      </button>

      <button
        onClick={() => onToggleTheme('classic')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          currentTheme === 'classic'
            ? 'bg-stone-100 text-stone-950 shadow-sm'
            : 'text-stone-300 hover:text-white'
        }`}
        title="আগের ক্লাসিক ডিজাইন"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>ক্লাসিক ডিজাইন</span>
        {currentTheme === 'classic' && <Check className="w-3 h-3 text-stone-950 ml-0.5" />}
      </button>
    </div>
  );
};
