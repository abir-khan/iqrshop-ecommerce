import React from 'react';
import { useCms } from '../context/CmsContext';

interface CategoryCircleBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCircleBar: React.FC<CategoryCircleBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { data } = useCms();
  const categoriesToDisplay = data.categories.filter((c) => c.id !== 'all');

  return (
    <section id="categories" className="hidden sm:block py-6 bg-white border-y border-zinc-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-9 overflow-x-auto no-scrollbar py-1">
          {categoriesToDisplay.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 group shrink-0 cursor-pointer text-center"
              >
                {/* Minimalist Icon Bubble */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#13231B] text-white border-[#13231B] shadow-sm scale-105'
                      : 'bg-zinc-50 border-zinc-200/80 group-hover:border-zinc-300 group-hover:bg-zinc-100'
                  }`}
                >
                  {cat.icon}
                </div>

                {/* Clean Label */}
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'text-zinc-950 font-bold'
                      : 'text-zinc-600 group-hover:text-zinc-900'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
