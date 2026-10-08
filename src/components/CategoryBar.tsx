import React from 'react';
import { CATEGORIES } from '../data/products';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white border-b border-stone-200 py-3 sticky top-16 sm:top-20 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Category Tabs (Luxora style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0f382c] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-end gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">সর্ট করুন:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-stone-100 border border-stone-200 rounded-full py-1.5 px-3 font-semibold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="popular">জনপ্রিয় পণ্য</option>
              <option value="price_low">কম দাম থেকে বেশি</option>
              <option value="price_high">বেশি দাম থেকে কম</option>
              <option value="rating">সর্বোচ্চ রেটিং</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};
