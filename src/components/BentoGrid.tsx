import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BentoGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'attar',
      title: 'প্রিমিয়াম আতর',
      subtitle: 'অ্যালকোহলমুক্ত খাঁটি সুবাস',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      isLarge: true,
    },
    {
      id: 'janamaz',
      title: 'তুর্কি জায়নামাজ',
      subtitle: 'মেমোরি ফোম আরাম',
      image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'tasbih',
      title: 'স্মার্ট তসবিহ',
      subtitle: 'ডিজিটাল ভাইব্রেশন রিং',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'panjabi',
      title: 'সুতি পাঞ্জাবি',
      subtitle: 'মার্জিত সুন্নতি পোশাক',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'organic',
      title: 'আজওয়া ও মধু',
      subtitle: '১০০% খাঁটি সুন্নাহ ফুড',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const largeCat = categories[0];
  const gridCats = categories.slice(1);

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Large Highlight Card (Left side - Luxora style) */}
        <div
          onClick={() => {
            onSelectCategory(largeCat.id);
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="lg:col-span-5 relative rounded-3xl overflow-hidden group cursor-pointer bg-stone-100 min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-6 sm:p-8"
        >
          <img
            src={largeCat.image}
            alt={largeCat.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative z-10 text-white space-y-2">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              {largeCat.subtitle}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">{largeCat.title}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-stone-900 px-4 py-2 rounded-full mt-2 group-hover:bg-amber-400 transition-colors">
              <span>কালেকশন দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 4 Small Category Cards (Right side grid - Luxora style) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {gridCats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer bg-stone-100 min-h-[200px] flex flex-col justify-end p-5"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              <div className="relative z-10 text-white space-y-1">
                <span className="text-[11px] text-amber-300 font-bold block">
                  {cat.subtitle}
                </span>
                <h4 className="text-lg font-black">{cat.title}</h4>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-amber-300 transition-colors pt-1">
                  <span>কালেকশন দেখুন</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
