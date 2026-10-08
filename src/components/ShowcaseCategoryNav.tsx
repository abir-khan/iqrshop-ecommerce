import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  english: string;
  icon: string;
  image: string;
  badge?: string;
}

interface ShowcaseCategoryNavProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

const SHOWCASE_CATEGORIES: CategoryItem[] = [
  {
    id: 'panjabi',
    name: 'পাঞ্জাবি',
    english: 'Panjabi',
    icon: '👔',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200&auto=format&fit=crop&q=80',
    badge: 'হট',
  },
  {
    id: 'attar',
    name: 'প্রিমিয়াম আতর',
    english: 'Attar & Oud',
    icon: '🌸',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&auto=format&fit=crop&q=80',
    badge: 'বেস্ট',
  },
  {
    id: 'janamaz',
    name: 'জায়নামাজ',
    english: 'Janamaz',
    icon: '🕌',
    image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'tasbih',
    name: 'স্মার্ট তসবিহ',
    english: 'Smart Tasbih',
    icon: '📿',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'organic',
    name: 'আজওয়া ও মধু',
    english: 'Sunnah Food',
    icon: '🍯',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'gift',
    name: 'গিফট কম্বো',
    english: 'Gift Combo',
    icon: '🎁',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80',
    badge: 'অফার',
  },
  {
    id: 'deals',
    name: 'স্পেশাল ডিল',
    english: 'Flash Sale',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&auto=format&fit=crop&q=80',
    badge: '৫০% ছাড়',
  },
];

export const ShowcaseCategoryNav: React.FC<ShowcaseCategoryNavProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section className="py-3 sm:py-6 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="h-px w-8 sm:w-16 bg-stone-300" />
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-stone-500 uppercase">
            TOP CATEGORIES • প্রধান কালেকশন
          </span>
          <div className="h-px w-8 sm:w-16 bg-stone-300" />
        </div>

        {/* Horizontal Category Circular / Rounded Cards Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-3.5 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-1 px-1">
          {SHOWCASE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 group shrink-0 cursor-pointer text-center select-none"
              >
                {/* Visual Circle Thumbnail with Border & Badge */}
                <div className="relative">
                  <div
                    className={`w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl overflow-hidden p-0.5 transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-emerald-800 scale-105 shadow-md'
                        : 'border-stone-200 group-hover:border-emerald-700 group-hover:scale-105 shadow-xs'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Badge */}
                  {cat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs uppercase tracking-tight">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'text-emerald-900 font-extrabold'
                        : 'text-stone-700 group-hover:text-emerald-800'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="hidden sm:block text-[9.5px] text-stone-400 font-medium">
                    {cat.english}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
